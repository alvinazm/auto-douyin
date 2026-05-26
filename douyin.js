console.show();
console.log("1. 启动抖音");
launchApp("抖音");
sleep(1000);

console.log("2. 上滑切换视频");
swipe(500, 1600, 500, 400, 500);

console.log("3. 等待3秒观看视频...");
sleep(3000);

// 3.5 点击关注按钮
var guanzhuBtn = descContains("关注").filter(function(b) {
    var bounds = b.bounds();
    return bounds.left >= 800 && bounds.top >= 900 && bounds.top <= 1300;
}).findOne(2000);

if (guanzhuBtn) {
    guanzhuBtn.click();
    console.log("关注成功");
    sleep(500);
}

console.log("4. 点赞");
var likeBtn = descContains("未点赞").filter(function(b) {
    var bounds = b.bounds();
    return bounds.left >= 800 && bounds.top >= 900 && bounds.top <= 1800;
}).findOne(2000);
if (likeBtn) {
    likeBtn.click();
    console.log("点赞成功");
}

console.log("5. 点击评论按钮");
var commentBtn = descContains("评论").filter(function(b) {
    var bounds = b.bounds();
    return bounds.left >= 800 && bounds.top >= 900 && bounds.top <= 1800;
}).findOne(2000);
if (commentBtn) {
    commentBtn.click();
    console.log("评论按钮点击成功");
}

sleep(2000);

console.log("6. 输入评论...");
var inputX = 360;
var inputY = 2244;

// 点击输入框激活
click(inputX, inputY);
sleep(1500);

// 全选
id("eq0").click();
sleep(300);

// 复制空字符串（清空剪贴板）
setClip("");
sleep(200);

// 粘贴（清空输入框）
id("eq0").paste();
sleep(500);

// 复制目标文字
setClip("这个做的太棒了");
sleep(200);

// 粘贴
id("eq0").paste();
sleep(1000);

console.log("评论输入完成");

// 7. 点击发送按钮
var sendBtn = text("发送").filter(function(b) {
    var bounds = b.bounds();
    return bounds.top >= 600 && bounds.top <= 800;
}).findOne(2000);

if (sendBtn) {
    var sendBounds = sendBtn.bounds();
    var x = (sendBounds.left + sendBounds.right) / 2;
    var y = (sendBounds.top + sendBounds.bottom) / 2;
    click(x, y);
    console.log("发送成功");
    sleep(1000);
}

// 8. 返回（两次返回到主视频页面）
back();
sleep(500);
back();
sleep(500);

// 9. 上滑到下一个视频
swipe(500, 1600, 500, 400, 500);
console.log("切换到下一个视频");
sleep(3000);
