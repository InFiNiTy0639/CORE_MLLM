VCR_PROMPT = """Given the image, answer the following question and provide a rationale.
Question: {question}
Answer Choices: {answers}
Select the correct answer and explain why based on visual evidence."""

WINOGROUND_PROMPT = """Does this image match the caption: "{caption}"? 
Answer 'Yes' or 'No' strictly."""

SCIENCEQA_PROMPT = """Question: {question}
Options: {options}
Think step-by-step to answer the question."""