import openai
from envs import chatGPT_API_Key

openai.api_key = chatGPT_API_Key

def chat_with_gpt3(prompt):
    response = openai.Completion.create(
        engine='text-davinci-003',  # Choose the ChatGPT model you prefer
        prompt=prompt,
        max_tokens=500,  # Set the maximum length of the response
        temperature=0,  # Controls the randomness of the response
        n=1,  # Set the number of responses to generate
        stop=None  # Specify a stop token if desired
    )
    
    return response.choices[0].text.strip()


def gptFromTopic(textIn):
    prompt = """In our previous conversation, I asked you to break down my text into objects representing individual claims of an argument, with each claim linked to previous claims if the evidence in the former justifies the latter.  There may be a lot of fluff, but I want you to simplify the text to *just* the claims.  Also, respond *only* with the objects.  Do not say anything else.

This time, I want you to create the objects (~15 sounds good) from the following topic:
{textIn}

Please format these objects as follows:
{"objects": 
[{id: 1, parent: "None", text: "Text of the first claim."},
{id: 2, parent: 1, text: "Text of the second claim that justifies the first claim."},
{...}]
}

Thank you!""".replace("{textIn}", textIn)
    return chat_with_gpt3(prompt)


def gptFromPreexisting(textIn, id):
    prompt = """In our previous conversation, I asked you to break down my text into objects representing individual claims of an argument, with each claim linked to previous claims if the evidence in the former justifies the latter.  There may be a lot of fluff, but I want you to simplify the text to *just* the claims.  Also, respond *only* with the objects.  Do not say anything else.

This time I want you to generate objects that disprove the claim below (it's id is {id}):
{textIn}

Please format these objects as follows:
{"objects": 
[{id: 1, parent: "None", text: "Text of the first claim."},
{id: 2, parent: 1, text: "Text of the second claim that justifies the first claim."},
{...}]
}

Thank you!""".replace("{id}", id).replace("{textIn}", textIn)
    return chat_with_gpt3(prompt)


def gptFromArgs(textIn):
    prompt = """
In our previous conversation, I asked you to break down my text into objects representing individual claims of an argument, with each claim linked to previous claims if the evidence in the former justifies the latter.  There may be a lot of fluff, but I want you to simplify the text to *just* the claims.  Also, respond *only* with the objects.  Do not say anything else.

Here's the text I'd like you to process into these objects:
{textIn}

Please format these objects as follows:
{"objects": 
[{id: 1, parent: "None", text: "Text of the first claim."},
{id: 2, parent: 1, text: "Text of the second claim that justifies the first claim."},
{...}]
}

Thank you!
""".replace("{textIn}", textIn)
    return chat_with_gpt3(prompt)

# # Example usage
# user_input = "Tell me about the costs of using the chatgpt api"
# response = chat_with_gpt3(user_input)
# print(response)