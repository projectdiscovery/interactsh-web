FROM ubuntu:20.04

COPY . .

WORKDIR /src/app/
EXPOSE 3000


RUN sudo chmod +x entrypoint.sh

ENTRYPOINT [ "./entrypoint.sh" ]

