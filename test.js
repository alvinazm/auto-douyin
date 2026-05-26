console.show();
console.log("测试动态查找收藏按钮...");

// 尝试多种收藏按钮描述
var collectBtn = null;
var descriptions = ['未收藏', '收藏'];

for (var i = 0; i < descriptions.length; i++) {
    var btns = descContains(descriptions[i]).filter(function(b) {
        var bounds = b.bounds();
        return bounds.left >= 800 && bounds.top >= 900 && bounds.top <= 1800;
    }).find();

    console.log('找到 "' + descriptions[i] + '" 按钮数量: ' + btns.length);
    
    if (btns.length > 0) {
        collectBtn = btns[0];
        console.log('使用: ' + descriptions[i]);
        break;
    }
}

if (collectBtn) {
    console.log('收藏按钮位置: ' + JSON.stringify(collectBtn.bounds()));
    collectBtn.click();
    sleep(1500);
    console.log('收藏成功');
} else {
    console.log('未找到收藏按钮');
}
