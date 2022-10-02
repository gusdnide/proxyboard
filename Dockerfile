FROM nikolaik/python-nodejs:latest
WORKDIR /app
COPY . .
RUN npm install
RUN apt update -y && apt upgrade -y && apt install tinyproxy -y
RUN pip install -r requirements.txt
EXPOSE 2059
ENTRYPOINT [ "node", "index.js" ]