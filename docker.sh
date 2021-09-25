#!/bin/bash
# 项目名称
name='nga-library-front'
# 对外端口
port=19000
imgName=${name}-image:latest
mapDir=/home/nga-library/repost/

docker container stop ${name}
docker container rm ${name}
docker image rm ${imgName}
docker build -t ${imgName} .
docker run -d -p ${port}:80 -v ${mapDir}:${mapDir} --restart always --name ${name} ${imgName}

rm -rf dist