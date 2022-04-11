# interactsh-web

[Interactsh-web](https://github.com/projectdiscovery/interactsh-web) is a free and open-source web client that displays [Interactsh](https://github.com/projectdiscovery/interactsh) interactions in a well-managed dashboard in your browser. It uses the **browser's local storage** to store and display interactions. By default, the web client is configured to use - **interachsh.com**, a cloud-hosted interactsh server, and supports other self-hosted public/authencaited interactsh servers as well.

A hosted instance of **interactsh-web** client is available at https://app.interactsh.com

<img width="2032" alt="interactsh-web" src="https://user-images.githubusercontent.com/8293321/135175927-07580994-32eb-4c06-8ca6-7ac9ea84776b.png">

# Run locally
Once successfully started, you can access it on [localhost:3000](http://localhost:3000)
## - Using Node
`git clone https://github.com/projectdiscovery/interactsh-web`

`cd interactsh-web`

`yarn install`

`yarn start`


## - Using Docker
`docker build -f Dockerfile -t interactsh-web ./`

`docker run -it -p 3000:3000 interactsh-web`