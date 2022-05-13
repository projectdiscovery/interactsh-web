# interactsh-web

[Interactsh-web](https://github.com/projectdiscovery/interactsh-web) is a free and open-source web client that displays [Interactsh](https://github.com/projectdiscovery/interactsh) interactions in a well-managed dashboard in your browser. It uses the **browser's local storage** to store and display interactions. By default, the web client is configured to use - **interachsh.com**, a cloud-hosted interactsh server, and supports other self-hosted public/authencaited interactsh servers as well.

A hosted instance of **interactsh-web** client is available at https://app.interactsh.com

<img width="2032" alt="interactsh-web" src="https://user-images.githubusercontent.com/8293321/135175927-07580994-32eb-4c06-8ca6-7ac9ea84776b.png">

## Configuring Self-Hosted Interactsh Server

- Navigate to hosted interactsh-web client at https://app.interactsh.com
- Click on `interact.sh` link at top bar
- Submit domain name running self-hosted interactsh server, optionally token (for protected server)

Here is an example configuring self-hosted interactsh server with web-client:

https://user-images.githubusercontent.com/8293321/163819390-b2677f3b-4c31-4439-b258-33b8bee87bf1.mp4

## Build from Source


<table>
<tr>
<td>

Note:
----

In order to run the local version of the web client, **acao-url** flag should be pointed to **localhost** while running interactsh server to avoid CORS errors. for example,

```
interactsh-server -acao-url http://localhost:3000
```
</td>
</tr>
</table>

### Using Yarn

```
git clone https://github.com/projectdiscovery/interactsh-web
cd interactsh-web
yarn install
yarn start
```

### Using Docker

```
docker pull projectdiscovery/interactsh-web
docker run -it -p 3000:3000 projectdiscovery/interactsh-web
```

Once successfully started, you can access web dashboard at [localhost:3000](http://localhost:3000)

-----

<div align="center">

**interactsh-web** is made with 🖤 by the [projectdiscovery](https://projectdiscovery.io) team.

</div>