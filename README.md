# 对nhfy项目的server服务端代码进行重构
### 技术栈
- node -v:14.15.1
- 框架：Express
- 数据库：MySQL
- ORM：sequelize
- 文件上传：multer
- 时间处理：moment
### 主要功能
- 对登录后的请求全部使用token认证（可使用jwt生成token。为了方便测试项目中只定义为token字符串）
- 处理前端(re_nhfy_client)项目中涉及到的所有请求

[前端项目](https://github.com/nda1992/re_nhfy_client.git)
### 数据库的配置(Linux环境下)
Step1:*数据库的文件：/myapp/database/re_nhfy.sql*<br>
Step2:
``` shell
mysql -uroot -p123456
create database re_nhfy
quit;
cd /myapp/re_nhfy_server/database
mysql -uroot -p123456 re_nhfy < re_nhfy.sql
```
Step3: 
```shell
vim /re_nhfy_server/myapp/config/config.json
```
Step4: *根据自己的mysql来配置dev、test、production三种环境的数据库数据库连接即可*

### 运行项目(启动服务端)
1. 直接在服务器上运行
请安装好mysql和node这两个环境依赖
 ```shell
git clone https://github.com/nda1992/re_nhfy_server.git
cd re_nhfy_server/myapp
npm install
npm install supervisor -g
supervisor .\bin\www
 ```
 ### 在docker上运行
 **可以在Linux或Windows上安装docker，我这里是在Windows10上安装的docker，[Windows10上如何安装docker?](https://zhuanlan.zhihu.com/p/148511634)**<br>
 *进入到项目的目录下进行以下操作*
 1. 创建Dockerfile
 ``` Dockerfile
FROM node:14.15.4
RUN mkdir -p /home/app
WORKDIR /home/app
COPY . /home/app
RUN npm install
RUN npm install supervisor
EXPOSE 3000
CMD ["npm", "start"]
 ```

2. 编辑docker-compose.yml文件
```
version: '3'

services:
  nodejs:
    build:
      context: .
      dockerfile: Dockerfile
    image: nodejs
    container_name: nodejs
    restart: unless-stopped
    ports:
      - "3000:3000"
    networks:
      - app-network

  db:
    image: mysql:5.7
    container_name: db
    restart: unless-stopped
    ports:
      - "3308:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=123456
      - MYSQL_USER=test
      - MYSQL_PASSWORD=123456
    volumes:
      - ./mysql:/var/lib/mysql
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```
**注意：上面运行的是mysql和nodejs两个容器，因为node.js项目需要访问数据库，项目是在本机运行，所以要查看本机的IP地址(使用ifconfig命令)，然后将该IP地址作为数据库的连接地址（使用localhost时出现被拒绝连接的错误，导致访问数据库失败），端口号使用上面yml文件配置的3308**
3. 创建镜像并启动容器
```
docker-compose up -d --build
``` 
4. 查看容器的运行情况
```
docker-compose ps
CONTAINER ID   IMAGE       COMMAND                  CREATED          STATUS          PORTS                                                  NAMES
ef374e878510   nodejs      "docker-entrypoint.s…"   13 minutes ago   Up 13 minutes   0.0.0.0:3000->3000/tcp, :::3000->3000/tcp              nodejs
d217b90f4446   mysql:5.7   "docker-entrypoint.s…"   47 minutes ago   Up 13 minutes   33060/tcp, 0.0.0.0:3308->3306/tcp, :::3308->3306/tcp   db
```

如果上述命令出现问题，请注意查看对应容器的log日志
```
docker logs container-name
```