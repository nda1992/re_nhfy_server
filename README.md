# 对nhfy项目的server服务端代码进行重构
### 技术栈
- 框架：Express
- 数据库：MySQL
- ORM：sequelize
- 文件上传：multer
- 时间处理：moment
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
 ```shell
git clone https://github.com/nda1992/re_nhfy_server.git
cd re_nhfy_server/myapp
npm install
npm install supervisor -g
supervisor .\bin\www
 ```