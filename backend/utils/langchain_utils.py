from langchain.memory import ConversationSummaryMemory
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains.summarize import load_summarize_chain

from db import get_chat_summary, update_chat_summary

map_prompt = PromptTemplate(
    input_variables=["text"],
    template="""
You are given a snippet of the conversation (one chunk). Summarize its key points, user goals, and any decisions, being descriptive as possible.
Snippet:
{text}

Summary:"""
)

combine_prompt = PromptTemplate(
    input_variables=["existing_summary", "text"],
    template="""
You have an existing overall summary:
{existing_summary}

And here are new chunk summaries:
{text}

Update the overall summary to include any new key points, make it as long and descriptive as possible.
New summary:"""
)


class PersistentSummaryMemory(ConversationSummaryMemory):
    """
    A ConversationSummaryMemory that loads its starting summary from DynamoDB
    and persists each update back to DynamoDB, using map-reduce summarization.
    """
    def __init__(self, *, chat_id: str, **kwargs):
        super().__init__(**kwargs)
        # bypass Pydantic’s __setattr__
        object.__setattr__(self, "chat_id", chat_id)

    def load_memory_variables(self, inputs: dict) -> dict:
        current = get_chat_summary(self.chat_id) or ""
        vars = super().load_memory_variables(inputs)
        vars[self.memory_key] = current
        return vars

    def save_context(self, inputs: dict, outputs: dict) -> None:
        super().save_context(inputs, outputs)
        # after the chain runs, pull out the updated summary and persist
        updated = super().load_memory_variables(inputs)[self.memory_key]
        update_chat_summary(self.chat_id, updated)


def create_memory_for_chat(chat_id: str) -> PersistentSummaryMemory:
    # 2) build a map-reduce summarization chain
    summarize_chain = load_summarize_chain(
        llm=ChatOpenAI(model_name="gpt-4o-mini", streaming=False),
        chain_type="map_reduce",
        map_prompt=map_prompt,
        combine_prompt=combine_prompt,
        # **no** document_variable_name here
    )

    return PersistentSummaryMemory(
        chat_id=chat_id,
        llm=ChatOpenAI(model_name="gpt-4o-mini", streaming=False),
        memory_key="chat_summary",
        input_key="user_input",
        output_key="assistant_response",
        max_token_limit=2000,        # chunk size for the map step
        summarize_chain=summarize_chain,
    )
