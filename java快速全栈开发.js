前端原型构建

ajax：跨域调用
1：jsonp
通过dom操作动态生成内联script标签，script标签不受同一域控制，jsonp请求在查询字符串中包含回调函数
2：CORS
Access-Control-Allow-Origin:*
 
LESS
1 在服务器端使用特定库，针对nodejs使用less模块

用getDATA()发送请求，再次定义一个具名函数防止出现回调嵌套(Pyramid of doom（金字塔厄运）)
Pyramid of doom说的是代码嵌套层次太深，太多的代码缩进，导致代码横向增长大于纵向增长。非常影响代码的可读性，因为我们看不清嵌套关系，很容易弄错变量的作用域，大括号多了或者少了等问题
优化：通过将过多if...else结构改写成具名函数调用


21种代码坏味道：http://blog.csdn.net/WALLEZhe/article/details/62217557


json插入script来实现跨域请求，将回调函数插入到查询字符串中

parse.com可以用来替换数据库和服务器的服务，适用于任何web和桌面应用程序的存储

按照RESTful api原则 
对一个对象进行更新的操作最好使用PUT 
删除操作使用delete

backbone.js  'path/:param':'action'当url为filename#path/param 触发名为action的函数


事件绑定

重构：视图/模板/路由器/集合/模型
keep it simple stupid原则

在使用多个库的情况下，最好使用js闭包来避免全局污染

AMD 允许我们将开发代码组织成模块，管理他们的依赖，异步加载他们
http://requirejs.org/docs/whyamd.html
通过require（）方式加载模块，第一个参数以数组的形式告诉浏览器需要加载的文件列表，将这些文件列表里的模块传递给匿名回调函数来作为参数，在主函数（匿名回调函数）可以使用这些模块的引用
例：
require（[“jquery.js”,'backbone.js','bootstrap.js'],function(referenceModule,referenceOtherModule){
	referenceModule.method();
}）
在第二个参数的函数里，通过文件名引用他们，通过相应的参数使用依赖关系，还可以定义模块本身，使用define()方法
define([..,..],function(..){
...
})
第二个参数接收别的库作为参数的方法，参数的顺序和数组里的模块重要
PS：不需要给文件名添加js后缀，require.js会自动添加，shim插件可以导入文本文件作为模板

所有代码基于逻辑分离到不同的文件里，主文件用require（）加载所有依赖，如果在非主文件里需要加载一些文件，用define（）请求他们，在一般模块里返回对象，在模板里返回一个字符串，在视图模块里返回backbone view类

原来的index.html会串行加载js脚本，新的amd/require文件会并行加载js脚本

线上产品尽可能使用浏览器缓存（怎么使用？）
https://segmentfault.com/a/1190000008289847

作为web开发人员经常遇到的问题之一就是我明明修复并且部署了这个BUG为什么线上有的用户还会出现这个问题呢？还有每次更新完我们都会说你清除缓存试试?为什么一定要清除缓存呢，可以肯定说绝大部分用户是不知道要清除缓存的！那我们能否不清除缓存，最新部署的文件能够马上就生效呢。答案是肯定的，这就需要我们花费一点时间了解一下缓存是怎么工作的。
我们可以简单的理解为缓存是为了减少网络带宽和优化用户体验而存在的。核心就是把缓存的内容保存在了本地，而不用每次都向服务端发送相同的请求，设想下每次都打开相同的页面，而在第一次打开的同时，将下载的js、css、图片等“保存”在了本地，而之后的请求每次都在本地读取，效率是不是高了很多。当我用浏览器打开一个网页可以发现浏览器加载页面资源的http请求返回的Status Code有以下常见的值304 Not Modified/200 OK (from disk cache)/ 200 OK。这些值代表着什么意思呢？其实浏览器就是依靠请求和响应中的的头信息来控制缓存的。下面我们来具体分析一下。
当我们第一次（或者ctrl+F5）打开百度，我们会发现加载jquery.js的http请求响应字段如下

1.Expires（过期时间）HTTP头信息Expires（过期时间） 属性是HTTP控制缓存的基本手段，这个属性告诉缓存器：相关副本在多长时间内是新鲜的。过了这个时间，缓存器就会向源服务器发送请求，检查文档是否被修 改。几乎所有的缓存服务器都支持Expires（过期时间）属性

注意：
Web服务器的时间和缓存服务器的时间必须是同步
如果有些不同步，缓存的内容提前过期了或者过期结果没及时更新
过期时间是固定时间，返回内容时候没有连带更新下次过期的时间，访问所有请求都会发送给源web服务器，增加了负载和响应时间

2、cache-control 缓存控制（最长周期）
如果max-age和expires同时存在，那么max-age优先级高于expires，
cache-control可以设置很多值

3、last-modified 这个响应资源的最后修改时间

4、etag 告诉浏览器当前资源在服务器的唯一标识（生成规则由服务器控制）



我们会发现浏览器是发送了一个http请求而不是我们之前说的在10年之内不发送请求，并且这个请求的响应是304，就是说当我按下F5时，浏览器忽略了上次请求返回的cache-control和expires字段的值，它是再次发送了一个获取资源的请求，但是这次http请求头部包含了两个新字段

If-Modified-Since和If-None-Match

（这两个字段的值就是上次请求资源响应中包含的Last-Modified和ETag的值），这就是问题所在，

服务器检测到这两个字段做对应的响应如下：

If-Modified-Since：服务器收到请求后发现有头If-Modified-Since则与被请求资源的最后修改时间进行比对。若最后修改时间较新，说明资源又被改动过，则响应整片资源内容（写在响应消息包体内），HTTP 200；
若最后修改时间较旧，说明资源无新修改，则响应HTTP 304 (无需包体，节省加载时间与带宽)，告知浏览器继续使用所保存的cache。

对于静态页面例如css图片等 服务器会自动完成last modified和if modified since的比较
对于动态页面而言，动态产生页面，没有包含last modified的信息，浏览器网关等就不会做缓存处理，每次请求都返回200

对于动态页面做缓存加速，要是响应头添加last-modified定义，其次根据请求中if modified since 和被请求的资源更新时间来返回200货304 虽然返回304已经做了一次数据库查询，但是可以避免接下来更多的数据库查询，没有返回页面内容只是一个http头，降低带宽消耗，提高用户体验
缓存有效通常会发生这样的过程：
第一次200
第二次cache 
f5刷新 304
强制刷新200 

If-None-Match: 服务器收到请求后发现有If-None-Match则与被请求资源的相应校验串进行比对，决定返回200或304。

浏览器缓存机制

https://www.cnblogs.com/lovesong/p/5352973.html


九种浏览器端缓存
http://blog.csdn.net/ztguang/article/details/51224744

Http头介绍:Expires,Cache-Control,Last-Modified,ETag
http://www.51testing.com/html/28/116228-238337.html





























在js文件开始部分可以添加reuqirejs.config来添加时间戳防止浏览器缓存，开发阶段用

npm安装js库，全局安装并使用app.build.js
({
appDir: './js',
baseUrl: './',
dir: 'build',
modules: [
    {
	name:"apple-app"
    }
]
})
将脚本文件移动至js目录，对应的是appdir属性，生成的文件会放到build目录，对应的是dir参数
r.js -o app.build.js
或node_modules/requirejs/bin/r.js -o app.build.js

会显示r.js处理的文件列表

减小文件大小使用uglify-js处理 uglify2模块
安装uglify-js，更新app.build.js文件，添加optimize:"uglify2"
({
appDir:‘./js’,
baseUrl: './'.
dir:'build',
optimize:'uglify2',
modules:[
    {
	name:'apple-app'
    }
]
})
运行r.js 
node_modules/requirejs/bin/r.js  -o app.build.js
 
维护js回调函数与UI事件混杂在一起的代码很有挑战性
backbone.js提供用于将逻辑代码组织成MVC结构，提供URL路径选择，REST api支持，事件监听器与触发器

如果添加越来越多的像“delete”，“update”按钮，异步回调会越来越复杂，
所以必须要知道什么时候更新视图，即消息列表，取决于数据是否改变，
backbone的MVC框架更易管理与维护复杂应用


使用requires语法和shim插件加载html模板，应用的路由程序只有一个首页路由，先将视图初始化，以便在整个引用里使用


后端原型构建

server.js
var http = require("http");//为服务器载入核心http模块
var port = process.env.PORT || 1337;//定义nodejs服务器要使用的端口，先尝试从环境变量中获取，如果环境变量没有则设置一个默认的值
var server = http.createServer(function(req,res){
	res.writeHead(200,{'content-Type':'text/plain'});//创建服务器程序，回调函数包括处理响应的代码，首部和响应状态码
	res.end("hello world\n");//输出字符
});
server.listen(port,function(){
	console.log("server is running at %s:%s",server.address().address,server.address().port);
})



nodejs服务 server.js
nodejs核心模块：
	其他模块通过npm获取
核心类、模块、方法、事件 http\util\querystring\url\fs

http
负责nodejs服务器 提供了很多方法

util
提供调试的工具函数

querystring
提供对查询字符串进行处理的工具函数
querystring.parse（）反序列化
.stringify（）序列化

url
提供url处理和解析的工具函数

fs
处理文件系统操作，如读写文件，既有同步函数也有异步函数

非核心模块
npmjs
github hosted list
nipster
node tracking

NPM
可以管理模块依赖和安装模块
package.json 包含了nodejs程序的元信息，版本号，作者，重要的是应用程序的依赖，这些信息以json格式保存，npm会读取它
{
"name":"blerg",
"description":"blerg blerg",
"version":"0.0.1",
"author":{
	"name":"jeff dean",
	"email":"jeff.dean@gmail.com"
},
"respository":{
	"type":"git",
	"url":"https://github.com/jeffdean/blerg.git"
},
"engines":{
	"node>=0.6.2"
},
"license":"MIT",
"dependencies":{
	"express":">=2.5.6",
	"mustache":"0.4.0",
	"commander":"0.5.2"
},
"bin":{
	"blerg":"./cli.js"
}
}

将包更新到最新版本，或者由package.json版本说明所定义的最新版本
npm update name-of-the-package
或者单独安装一个模块
npm install name-of-the-package


设置首部和状态码:
res.writeHead(200,function(){
	'Content-Type':'text/plain'
});

res.end("hello world\n");
console.log(res.method);
.listen(1337,'127.0.01');


curl命令测试 
命令行接口模拟post请求：
curl -d "name=BOB&message=test" http://127.0.01:1337/messages/create/json

nodejs框架
derby 构建实时，协作应用mvc
express 最健壮，测试最完善，使用最多nodejs框架
restify 构建rest api框架
sails mvc
hapi expresss基础上构建的框架
connect nodejs中间件

程序可以改进的地方：
改进已有测试用例，对比对象而不是字符串
将测试数据从mb-server.js移到test.js里
给前端代码添加测试用例
为每一个消息生成一个id，用散列而不是数组存储消息
安装mocha并用它重构test.js

目前消息存储在内存里，程序重启消息丢失，需要永久存储，mongodb可以解决这个问题


MongoDB
mongodb shell

mongodb原生驱动
要将依赖添加到package.json里

process.env 可以访问环境变量 数据库主机名 端口 密码 api密钥 端口号和其他信息，这些信息不能编码进主逻辑

Bson 
mongoDB专有数据类型 像json但支持更复杂的数据类型


整合前后端
1、前后端不同域 保证在使用cors和jsonp的时候没有跨域问题
2、相同域部署，确保nodejs处理前端静态文件和资源文件，正式上线不推荐

不同域部署

为了使不同域的部署能够正常工作，需要把受同一域限制的ajax换成jsonp
var request = $.ajax({
	url: url,
	dataType:'jsonp',
	data:{...},
	jsonpCallback:"fetchData",
	type:'GET'
})
或者在nodejs服务器应用返回前添加options方法和特殊的响应头部 也叫cors

response.writeHead(200,{
	'Access-Control-Allow-Origin': origin,
	'Content-Type':'text/plain',
	'Content-Length':body.length
})
or 
res.writeHead(200,{
	'Access-Control-Allow-Origin': 'your-domain-name',
	...
})
options 方法所需信息在http访问控制里有定义，options请求可以通过下面代码进行处理
if (request.method == "options"){
	response.writeHead('204','Content',{
		'Access-Control-Allow-Origin':origin,
		'Access-Control_Allow_Methods':
			'GET,PUT,POST,DELETE,OPTIONS',
		'Access-Control-Allow-Headers':'content-type, accept'
		'Access-Control-Max-Age':10,//seconds
		'Content-Length':0
});
	response.end();
}

修改入口


部署

git提交

同域部署
不推荐在不同的生产环境中进行同域部署,静态资源文件使用nginx更合适，分离api减少测试的复杂性，提高程序的健壮程度，更快的定位问题和监控
更优雅的方式建议使用nodejs框架 如connect或者express ，他们有专门用于js和css资源的static中间件


webapp文章

nodejs里的异步
nodejs拥有非阻塞I/O机制

异步编码方式
var test = function(callback){
	return callback();
	console.log("test');		//不会被打印
}

var test2 = function(callback){
	callback();
	console.log('test2');		  //第3个打印
}

test(function(){
	console.log('callback');      	  //第1个打印
	test2(function(){
		console.log('callback2'); //第2个打印
	});
})

setTimeOut会等待序列中的所有函数都执行完成，再执行

使用Monk迁移MongoDB 
恢复数据库

1、mongo shell 脚本
2、nodejs程序

加载所有模块 monk、progress、async、mongoDB


在nodejs里使用mocha实践tdd
谁需要使用测试驱动的开发
例
在一个已经存在接口上实现复杂的功能（添加一个like选项）
在没有测试的情况下，必须要人工创建登陆，创建文章，创建评论，赞
新添加的功能破坏已有的功能，暂时未发现

不要为一次性的代码写测试，但针对主代码，养成测试驱动的习惯
1、快速开始指南
安装mocha 安装superagent和expect.js库 

打开新.js文件 输入
var request = require("superagent");
var expect = require("expect.js");

expect检查返回是否正确的便捷函数：
expect(res).to.exit;
expect(res.status).to.equal(200);
expect(res.body).to.contain("world");

添加done（）调用 告诉mocha，这个异步测试已经完成
如果想在请求前处理，可以通过before和beforeEach() 每一个测试运行前执行

wintersmith 静态网站生成器
markdown jade underscore
为什么使用静态网站生成器
1、模板 
jade	使用空格来组织级联元素
2、Markdown
使用marked作为markdown解析器
3、简单的部署
所需的东西需htmlcssjs 只需ftp客户端上传
4、基本服务
任何静态web服务器都可以正常工作 
5、性能
没有数据库调用、没有服务器端api调用、没有cpu或者内存过载 
6、灵活性
可以为内容和模板加载插件，也可以自己写插件

其他静态网站生成器
docpad
blacksmith
scotch
wheat
petrify

rails和php生成器


expressjs教程 使用monk和mongodb的简单rest api应用

创建新文件夹，写入依赖package.json
为了保持简洁，应将所有代码都写入index.js文件内：
var mongodb = require("mongodb");
var express= require("express");
.....

先引入模块声明
数据库和express应用的实例化
var db = monk('localhost:2707/test');
var app = new express();


告诉express应用应从public目录加载和服务器静态文件
app.use(express.static（__dirname + '/public'）);

首页 也叫根路由的设置
app.get("/",function(req,res){
	db.driver.admin.listDatabases(function(e,dbs){
		res.join(dbs);
	})
})
get()包含两个参数 字符串和函数 
函数必须有两个参数 请求和响应 请求包含所有的譬如查询字符串，会话和首部的信息，响应是要返回的结果
这个例子里res.json()函数来返回

db.driver.admin.listDatabases（）异步返回数据库列表

express支持http操作，譬如post和update
例
app.post('product/:id',function(req,res){...});

express也支持中间件   中间件是一个请求处理函数，三个参数为
request,response,next
例
app.post('product/:id',authenticate,validateProduct,addProduct);
function authenticate(req,res,next){
	验证用户
	next();
}
function validateProduct(req,res,next){
	验证提交数据
	next();
} 
function addProduct(req,res){
	保存到数据库
}

其中validateProduct和authenticate是中间件 大项目中一般放到单独的文件中

另一个设置中间件的方式 使用use()函数

之前：
app.use(express.static（__dirname + '/public'）);

现在可以：
app.use(errorHandler);

expressjs教程：参数 错误处理和其他中间件
1、请求处理函数
express提供了组织路由的方式 每一个路由通过把url也可以使用正则表达式作为第一个参数调用应用对象上的函数
例：
app.get('api/vl/stotries',function(req,res){
	...
})
or post method :
app.post('api/vl/stotries',function(req,res){
	...
})
传递给get或post()方法的回调叫做请求处理函数 ，会接收并处理请求（req），然后写入到res对象
例：
app.get('/about',function(req,res){
	res.send("about us:...");
});
可以使用多个请求处理的函数，他们的名字叫中间件，他们接收第三个参数 next() 调用他会顺序执行下一个请求处理函数

app.get('/api/vl/stotries/:id',function(req,res,mext){
	进行验证
	没有通过验证或者有错误，next（error）
	通过且没错误
	return next();
})

需要用url字符串里的id参数来查询在数据库里对应匹配项

参数处理中间件
如果没有express库 必须使用nodejs模块
要使用HTTP.request对象
require("querystring").parse(url)
or 
require('url').parse(url,true)
做这样的处理

express可以使用中间件来支持参数处理错误
app.param（'id',function(req,res,next,id){
	使用id做一些事情
	保存id或者其他信息到请求对象中
	完成后调用next（）函数
	next();
}）
app.get('/api/vl/stotries/:id',function(req,res){
	参数处理中间件将在此之前执行
	期待请求对象上已经有保存的信息
	输入一些东西
	res.send(data);
})
使用多个请求处理函数，原理也一样，预期获取req.story对象或者一个之前执行里抛出的错误，可以抽象出获取参数及其各自对象的通用代码逻辑
登陆校验和输入过滤也非常适合放到中间件里
param() 可以合并不同的参数
app.get('/api/vl/stotries/:storyid/elements/:elementId',function(req,res){
	res.send(req.element);
})

错误处理：
错误处理贯穿整个程序生命周期，最好也以一个中间件形式存在，有相同参数 只是多了一个error
app.use(function(err,req,res,next){
	日志记录和用户友好的错误消息输出
	res.send(500)
})
响应可以是任何东西

JSON字符串

app.use(function(err,req,res,next){
	日志记录和用户友好的错误消息输出
	res.send(500,{
			status:500,
			message:'internal error',
			type：'internal'
	})
})

纯文本信息
app.use(function(err,req,res,next){
	res.send(500,"internal server error");
})

错误页
app.use(function(err,req,res,next){
	res.render('500');
})
跳转到一个错误页
app.use(function(err,req,res,next){
	res.redirect(/public/500.html);
})
错误http响应码
app.use（function(err,req,res,next){
	res.end(500);
}）


日志也可以抽象成中间件
next(error);
or
next(new Erro('something went wrong:-('));

也可以使用多个错误处理函数，并使用具名函数，而不使用匿名函数


其他中间件


除了提取参数 也可以登陆校验 错误处理 会话以及输出

res.json()将js或者nodejs对象转化成JSON


抽象
中间件可以使用匿名或者具名函数 最好的方式可以把请求处理函数按功能抽象到单独的外部模块里：


...

需要创建一个简单的 REST API 服务器的时候express和mongoskin都可以用




