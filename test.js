console.show();
console.log("测试动态查找关注按钮...");

// 查找所有 desc 包含"关注"的 Button
var followBtns = descContains("关注").filter(function(b) {
    var bounds = b.bounds();
    // 过滤条件：右侧区域，y 在视频点赞按钮附近
    return bounds.left >= 800 && bounds.top >= 900 && bounds.top <= 1300;
}).find();

console.log("找到关注按钮数量: " + followBtns.length);

if (followBtns.length > 0) {
    // 取第一个（应该是视频旁边的关注按钮）
    var followBtn = followBtns[0];
    console.log("关注按钮位置: " + JSON.stringify(followBtn.bounds()));

    // 点击元素
    followBtn.click();
    sleep(1500);
    console.log("点击成功");
} else {
    console.log("未找到关注按钮");
}