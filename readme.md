# LogicFlow
## Inspiration
Whenever we have certain projects or problems to solve, we want to be sure that we have all of our bases covered.  Is our new feature idea useful?  What libraries could we use to make it?  What challenges might we face in implementing through each library option? 
Sure, we could track this with pen and paper, but it's limited by what we remember from our conversations and however valid we feel those points are when writing.  If we could track concerns, concerns about those concerns, and the validity of the concerns of our concerns, we can make a truth table to determine the effectiveness of our ideas.

## What it does
LogicFlow takes a prompt from topics or problem discussion to create a flowchart of the claims relevant to the topic. This flowchart is a deconstruction of answers from our inputted prompt. The top boxes of the flowcharts are the claims and the boxes under those claims relate back to it, further enforcing the claim's validity and other arguments. ChatGPT provides us the answers from the user's prompt, and LogicFlow takes those answers and crafts them into a readable/digestible flowchart.

## How we built it
We built LogicFlow using the generative power of ChatGPT.  We are using Flask (Python) as our web framework to run the site.  Our charts use the joint.js library. Everything else has been created from scratch. 

## Challenges we ran into
Most unexpectedly, we found that flowchart libraries largely ignore placement and style of objects.  It fell on us to create an effective UX in flowchart style, which was by far the most time consuming issue of the day.  This also left the rest of the site with a weak UI given our compressed timeframe remaining. Another issue was configuring the generation of the flowchart boxes themselves with text from ChatGPT. 

## Accomplishments that we're proud of
We're very proud of the fact that we created a usable base model of this software. While we wish that we could add even more features, what we have accomplished so far with the generative flowcharts more than satisfies us for now.  We also believe the effectiveness of our categorization prompt makes this project truly useful - using it to summarize and visualize the base cases of large articles was fulfilling from a dev standpoint.

## What we learned
We learned how to use the ChatGPT api to create data structured for computer processing as well as how diagram libraries work in Javascript. We also learned how to properly render shapes on the browser screen.

## What's next for LogicFlow
What we want to do next for LogicFlow is implement logic in the flowchart patterns via different classes of nodes, tree pruning, and fallacy correction, like circular reasoning, which we can detect by a loop in our visuals.
Among other features, we would have also liked to add features such as automatic generation of new nodes that could falsify user-inputted claims, hopefully opening discussion into potential issues before they arise. 

## How to run:
`pip install openai flask`

Using envs.py.example as a template, create envs.py to include your openai api key

`python3 app.py`