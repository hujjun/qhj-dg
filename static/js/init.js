var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var video = document.getElementById("video");
var appear_video = document.getElementById("appear_video");
var shift = document.getElementById("shift");

var relay_photo = document.getElementById("relay_photo");
var relay_btn = document.getElementById("relay_btn");
var relay_div = document.getElementById("relay");
var Countdown = document.getElementById("Countdown");
var intetval = document.getElementById("intetval");
var relay_cancel = document.getElementById("relay_cancel");

var play_btn = document.getElementById("play");
var continue_btn = document.getElementById("continue");

var range_num = document.getElementById("set_frame");
var modal_set_frame = document.getElementById("modal_set_frame");
var input_num = document.getElementById("input_num");
var cancel_range_num_btn = document.getElementById("cancel_range_num_btn");
var photo = document.getElementById("photo");
var current_page = document.getElementById("current_page");
var image_div = document.getElementById("image");

var zip = document.getElementById("zip");
var queue = document.getElementById("queue");

var photos = [];

var frames = [];
var results = [];
var xml = {
  sequence: {
    width: 1920,
    height: 1080,
    fps: 24,
    totalFrames: 48,
    isLoop: "0",
    isRegister: "1",
    frames: [],
  },
};
var second = 1000;
var speed = 41; //1000/24~41一秒二十四帧

var set_cover = document.getElementById("set_cover");
var cover = document.getElementById("cover");
var translate = document.getElementById("tanslate");

// 抠图与打包pdf用的canvas
const oCanvas = document.getElementById("my-canvas");
const output = document.getElementById("a4_out");

// 抠图与打包pdf用的canvas实例
const ctx = oCanvas.getContext("2d");
const octx = output.getContext("2d");

//删除帧的弹出框按钮
var del_btn = document.getElementById("del");
var copy = document.getElementById("copy");
var global_width = 0;
var global_height = 0;
var pdf = new jsPDF("", "pt", "a4");

var per = 0;
var per_div = document.getElementById("per");
var percent = document.getElementById("percent");
percent.style.display = "none";

var audio_btn = document.getElementById("audio");
var stop_audio = document.getElementById("stop_audio");
var audio_div = document.getElementById("audio_div");
var audio_check = document.getElementById("audio_check");
var audio_cancel = document.getElementById("audio_cancel");
var start_frame = document.getElementById("start_frame");
var end_frame = document.getElementById("end_frame");

var voice = document.getElementById("voice");
var voice_finished = document.getElementById("voice_finished");
var media = { video: { facingMode: { exact: "environment" } } };
var shift_f_b = false;
var camera = { video: { facingMode: "user" } };
var conduct = document.getElementById("conduct");

// connectMachine(media);

conduct.onclick = function () {
  conduct.style.display = "none";
};
// 返回
var returngo = document.getElementById("returngo");
returngo.onclick = function () {
  console.log("123");
};
// 切换摄像头
var videoSrc = document.getElementById("videoSrc");
var change = document.getElementById("change");
change.onclick = function(){
  videoSrc.style.display = "block";
}
  var video = document.getElementById("video");
  var videoSelect = document.querySelector("select#videoSource");
  navigator.mediaDevices
    .enumerateDevices()
    .then(gotDevices)
    .then(getStream)
    .catch(handleError);
  videoSelect.onchange = getStream;
  function gotDevices(deviceInfos) {
    for (var i = 0; i !== deviceInfos.length; ++i) {
      var deviceInfo = deviceInfos[i];
      var option = document.createElement("option");
      option.value = deviceInfo.deviceId;
      if (deviceInfo.kind === "videoinput") {
        option.text = deviceInfo.label || "camera " + (videoSelect.length + 1);
        videoSelect.appendChild(option);
      } else {
        // console.log(deviceInfo);
      }
    }
  }
  function getStream() {
    if (window.stream) {
      window.stream.getTracks().forEach(function (track) {
        track.stop();
        videoSrc.style.display = "none";
      });
    }
    var constraints = {
      video: {
        width: 1920,
        height: 1080,
        deviceId: {
          exact: videoSelect.value,
        },
      },
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(gotStream)
      .catch(handleError);
  }
  function gotStream(stream) {
    window.stream = stream; // make stream available to console
    video.srcObject = stream;
  }
  function handleError(error) {
    console.log("Error: ", error);
  }
photo.addEventListener("click", function () {
  if (getStyle(image_div, "display") == "block") {
    video.style.display = "block";
    image_div.style.display = "none";
    appear_video.style.display = "block";
  } else {
    voice.play();
    catch_image();
  }
});

input_num.oninput = function () {
  document.getElementById("fps").innerHTML = input_num.value;
};
range_num.onclick = function () {
  modal_set_frame.style.display = "block";
};
cancel_range_num_btn.onclick = function () {
  modal_set_frame.style.display = "none";
  xml.sequence.fps = parseInt(input_num.value);
};
// 删除
del_btn.onclick = function () {
  var delImages = document.getElementsByClassName("delete");
  var ids = [];
  for (var i = 0, len = delImages.length; i < len; i++) {
    var id = delImages[i].getAttribute("id");
    ids.push(id);
  }
  for (var j = 0, len2 = ids.length; j < len2; j++) {
    var id = ids[j];
    var del_frame = document.getElementById(id);
    queue.removeChild(del_frame);
    var str = del_frame;
    photos = del_ele_in_array(photos, str);
  }
  current_page.innerHTML = photos.length;
  if (photos.length == 0) {
    image_div.style.display = "none";
    appear_video.style.display = "block";
  }
  current_page.innerHTML = photos.length;
  xml.sequence.totalFrames = photos.length;
};
// 复制
copy.onclick = function () {
  var copyImages = document.getElementsByClassName("delete");
  for (var i = 0, len = copyImages.length; i < len; i++) {
    var src = copyImages[i].getAttribute("src");
    var img = document.createElement("img");
    img.setAttribute("src", src);
    var id = Math.random();
    img.setAttribute("id", id);
    img.onclick = function () {
      // 复制后的图片
      var frame_img = document.createElement("img");
      frame_img.setAttribute("src", this.getAttribute("src"));

      image_div.style.display = "block";
      del_btn.setAttribute("del-src", this.id);
      del_btn.style.display = "block";

      if (getStyle(this, "borderStyle") == "none") {
        this.style.border = "2px solid red";
        this.classList.add("delete");
      } else {
        this.classList.add("delete");
        this.style.borderStyle = "none";
      }
      image_div.setAttribute("src", this.getAttribute("src"));
    };
    queue.appendChild(img);
    photos.push(img);
  }
  current_page.innerHTML = photos.length;
  xml.sequence.totalFrames = photos.length;
};
// 延时摄影
relay_photo.onclick = function () {
  relay_div.style.display = "block";
};
// 延时摄影开始
relay_btn.onclick = function () {
  relay_div.style.display = "none";
  count_time = parseFloat(Countdown.value);
  count_time = parseInt(count_time * 1000);
  intetval_time = parseFloat(intetval.value);
  intetval_time = parseInt(intetval_time * 1000);
  relay_camera(count_time, intetval_time);
};
// 延时摄影取消
relay_cancel.onclick = function () {
  relay_div.style.display = "none";
};
// 播放
play_btn.onclick = function () {
  video.style.display = "none";
  appear_video.style.display = "none";
  image_div.style.display = "block";
  var frame = parseInt(input_num.value);
  speed = parseInt(1000 / frame);
  play();
};
// 继续拍摄
continue_btn.onclick = function () {
  video.style.display = "block";
  image_div.style.display = "none";
  appear_video.style.display = "block";
  photo.style.display = "block";
  continue_btn.style.display = "none";
};
// 翻翻书
set_cover.onclick = function () {
  //if (photos.length<70) {
  //	alert('请排满70张再合成！！当前张数为：'+photos.length);
  //}else{
  //	cover.style.display='block';
  //}
  cover.style.display = "block";
};

translate.onclick = function () {
  var i = 0;
  cover.style.display = "none";
  percent.style.display = "block";
  onImageLoad(i);
};
// 录音
audio_btn.onclick = function () {
  // media={ video:true,audio: true};
  // connectMachine(media);
  startRecording();
  // this.style.display = "none";
  // stop_audio.style.display = "block";
};
// 停止录音
// stop_audio.onclick = function () {
//   send();
//   stop_audio.style.display = "none";
//   document.getElementById("audio").style.display = "block";
//   // media={ video:true};
//   // connectMachine(media);
// };
// 取消
audio_cancel.onclick = function () {
  audio_div.style.display = "none";
};
// 打包
// zip.onclick = function () {
//   var i;
//   var len;
//   var src;
//   len = photos.length;
//   var fps = xml.sequence.fps.toString();
//   var totalFrames = xml.sequence.totalFrames.toString();
//   var xmlDoc =
//     '<sequence width="1920" height="1080" fps=' +
//     fps +
//     " totalFrames=" +
//     totalFrames +
//     ' isLoop="0" isRegister="1">';
//   console.log(xmlDoc);
//   for (i = 0; i < len; i++) {
//     if (i <= 9) {
//       var url = "00" + i.toString() + ".jpg";
//     } else {
//       var url = "0" + i.toString() + ".jpg";
//     }
//     var fragent = '<frame url="' + url + '" alpha="1"/>';
//     xmlDoc += "\n" + fragent;

//     console.log(src);
//   }
//   xmlDoc += "\n</sequence>";
//   console.log(xmlDoc);
// };

function catch_image() {
  context.drawImage(video, 0, 0, 1280, 720);
  var dataURL = canvas.toDataURL("image/jpeg"); //转换图片为dataURL
  var img = document.createElement("img");
  img.setAttribute("src", dataURL);
  var id = Math.random();
  img.setAttribute("id", id);
  img.onclick = function () {
    // var frame=document.getElementById("frame");
    // frame.innerHTML='';
    var frame_img = document.createElement("img");
    frame_img.setAttribute("src", this.getAttribute("src"));
    //frame.appendChild(frame_img);
    //var x=this.offsetLeft;
    //var y=this.offsetTop+380;
    video.style.display = "none";
    image_div.style.display = "block";
    appear_video.style.display = "none";
    del_btn.setAttribute("del-src", this.id);
    del_btn.style.display = "block";
    //del_btn.style.position="absolute";
    //del_btn.style.left=x.toString()+"px";
    //del_btn.style.top=y.toString()+"px";

    if (getStyle(this, "borderStyle") == "none") {
      this.style.border = "2px solid red";
      this.classList.add("delete");
    } else {
      this.classList.add("delete");
      this.style.borderStyle = "none";
    }
    image_div.setAttribute("src", this.getAttribute("src"));
  };

  queue.appendChild(img);
  photos.push(img);
  current_page.innerHTML = photos.length;
  xml.sequence.totalFrames = photos.length;
}
//预览播放
function play(speed) {
  var time = time;
  var i = 0;
  var len = photos.length;
  var file = photos[i];
  //playRecord(msg[1].blob);
  cicle_show_image(i, len, speed);
}
var k = 1;
//循环展示图片
function cicle_show_image(i, len) {
  if (i >= len) {
    k = 1;
    return;
  }
  var img = photos[i];

  if (typeof msg[k] !== "undefined") {
    if (msg[k]["start"] == i + 1) {
      playRecord(msg[k].blob);
    } else if (msg[k]["end"] == i + 1) {
      stopRecord();
      k++;
    }
  }

  image_div.setAttribute("src", img.getAttribute("src"));

  i++;
  setTimeout("cicle_show_image(" + i + "," + len + ")", speed);
}
//从数组中删除帧图片数据
function del_ele_in_array(arr, ele) {
  var arr = arr;
  var ele = ele;
  for (var i = 0, len = arr.length; i < len; i++) {
    if (arr[i] === ele) {
      arr.splice(i, 1);

      return arr;
    }
  }
  return arr;
}

function relay_camera(count_time, intetval_time) {
  var count_time = count_time;
  var intetval_time = intetval_time;
  if (count_time <= 0) {
    upload_to_server_to_merge();
    return;
  }
  catch_image();
  count_time -= intetval_time;
  setTimeout(
    "relay_camera(" + count_time + "," + intetval_time + ")",
    intetval_time
  );
}

//抠图与打包pdf

// 上面读取资源的操作后，将图像画到canvas上
function onImageLoad(i) {
  if (photos[i] === undefined) {
    var j = 10;
    mregeBackground(j, frames.length);
    return;
  }
  var image = new Image();
  image.src = photos[i].src;
  image.onload = function () {
    const width = (oCanvas.width = image.naturalWidth || image.width);
    const height = (oCanvas.height = image.naturalHeight || image.height);
    global_width = width;
    global_height = height;
    ctx.drawImage(image, 0, 0);

    // 获取画布像素信息
    const imageData = ctx.getImageData(0, 0, width, height);

    // 一个像素点由RGBA四个值组成，data为[R,G,B,A [,R,G,B,A[...]]]组成的一维数组
    // 可以通过修改该数组的数据，达到修改图片内容的目的
    const data = imageData.data;
    filter(data); // 这里对图像数据进行处理

    // 把新的内容画进画布里
    ctx.putImageData(imageData, 0, 0);

    var bg = new Image();
    bg.src = "static/bg.jpg";

    bg.addEventListener("load", function (event) {
      ctx.globalCompositeOperation = "destination-over";
      ctx.drawImage(bg, 0, 0, width, height);
      var dataURL = oCanvas.toDataURL("image/jpeg"); //转换图片为dataURL

      frames.push(dataURL);
      i++;
      onImageLoad(i);
    });
  };
}

//抠图算法
function filter(data) {
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i],
      g = data[i + 1],
      b = data[i + 2];
    //g通道的值与r,b通道的值各相差大于20时
    var difference_g_r = g - r;
    var difference_g_b = g - b;
    if (difference_g_b > 10 && difference_g_r > 10) {
      var average = (r + g + b) / 3;
      if (g <= 20) {
        data[i] = data[i + 1] = data[i + 2] = 0;

        data[i + 3] = 150;
      } else if (g <= 30) {
        data[i] = data[i + 1] = data[i + 2] = average;

        data[i + 3] = 150;
      } else if (g <= 60) {
        data[i] = data[i + 1] = data[i + 2] = average;

        data[i + 3] = 150;
      } else {
        data[i + 3] = 0;
      }
    }
  }
}
function onImageErr() {
  oInput.classList.add("err");
}

function mregeBackground(i, len) {
  if (len <= 10) {
    var j = 0;
    var bg = new Image();
    bg.src = "static/background/10.jpg";
    bg.onload = function () {
      octx.globalCompositeOperation = "source-over";
      octx.drawImage(bg, 0, 0, 2480, 3508);

      mergeImages(j, j + 10, 375, 150);
    };
    return;
  }
  var len = len;
  var i = i;
  var j = i - 10;

  if (i > len) {
    return;
  }

  var bg = new Image();
  bg.src = "static/background/" + i + ".jpg";
  bg.onload = function () {
    octx.globalCompositeOperation = "source-over";
    octx.drawImage(bg, 0, 0, 2480, 3508);

    mergeImages(j, j + 10, 375, 150);
  };
}
function mergeImages(i, j, x, y) {
  per_div.innerHTML = per;
  per += 1.5;
  if (frames[i] === undefined) {
    var pageData = output.toDataURL("image/jpeg"); //转换图片为dataURL
    results.push(pageData);

    // console.log('print pdf document');
    per = 100;
    per_div.innerHTML = per;
    //addImage后两个参数控制添加图片的尺寸，此处将页面高度按照a4纸宽高比列进行压缩
    pdf.addImage(
      pageData,
      "JPEG",
      0,
      0,
      595.28,
      (592.28 / output.width) * output.height
    );
    //pdf.save('stone.pdf');
    octx.clearRect(0, 0, 2480, 3508);
    setCover();
    return;
  }
  if (i > j) {
    i = i - 1 + 10;
    var pageData = output.toDataURL("image/jpeg"); //转换图片为dataURL
    //addImage后两个参数控制添加图片的尺寸，此处将页面高度按照a4纸宽高比列进行压缩
    pdf.addImage(
      pageData,
      "JPEG",
      0,
      0,
      595.28,
      (592.28 / output.width) * output.height
    );
    pdf.addPage();
    results.push(pageData);
    octx.clearRect(0, 0, 2480, 3508);
    // console.log('add a page of A4 paper');
    mregeBackground(i, frames.length);
    return;
  }

  const width = 800;
  const height = 450;
  var bg = new Image();
  bg.src = frames[i];
  bg.addEventListener("load", function (event) {
    octx.drawImage(bg, x, y, width, height);

    if (y >= 2842) {
      y = 150;
      x += 1100;
    } else {
      y += 673;
    }

    i += 1;

    mergeImages(i, j, x, y);
  });
}

function setCover() {
  var title = document.getElementById("title").value;
  var editor = document.getElementById("editor").value;
  var time = getNowDate();

  const width = 2480;
  const height = 678;

  octx.clearRect(0, 0, 2480, 3508);
  octx.fillStyle = "#fff";
  octx.fillRect(0, 0, 2480, 3508);
  octx.globalCompositeOperation = "source-over";
  var cover = new Image();
  cover.src = "static/cover.jpg";
  cover.addEventListener("load", function (event) {
    octx.drawImage(cover, 0, 150, width, height);
    octx.font = "italic 60px 黑体";
    octx.fillStyle = "#000";
    octx.fillText(title, 330, 320);
    octx.fillText(editor, 330, 500);
    octx.fillText(time, 230, 740);
    pdf.addPage();
    var pageData = output.toDataURL("image/jpeg");
    percent.style.display = "none";
    pdf.addImage(
      pageData,
      "JPEG",
      0,
      0,
      595.28,
      (592.28 / output.width) * output.height
    );
    pdf.save("test.pdf");
  });
}
function getNowDate() {
  var date = new Date();
  var sign1 = "-";
  var sign2 = ":";
  var year = date.getFullYear(); // 年
  var month = date.getMonth() + 1; // 月
  var day = date.getDate(); // 日
  var hour = date.getHours(); // 时
  var minutes = date.getMinutes(); // 分
  var seconds = date.getSeconds(); //秒
  var weekArr = [
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
    "星期天",
  ];
  var week = weekArr[date.getDay()];
  // 给一位数数据前面加 “0”
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (day >= 0 && day <= 9) {
    day = "0" + day;
  }
  if (hour >= 0 && hour <= 9) {
    hour = "0" + hour;
  }
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  }
  var currentdate =
    year +
    sign1 +
    month +
    sign1 +
    day +
    " " +
    hour +
    sign2 +
    minutes +
    sign2 +
    seconds +
    " " +
    week;
  return currentdate;
}
// 调取摄像头
// function connectMachine(media) {
//   window.navigator.getUserMedia =
//     navigator.getUserMedia ||
//     navigator.webKitGetUserMedia ||
//     navigator.mozGetUserMedia ||
//     navigator.msGetUserMedia;
//   if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//     navigator.mediaDevices
//       .getUserMedia(media)
//       .then(function (stream) {
//         appear_video.src = (window.URL || window.webkitURL).createObjectURL(
//           stream
//         );
//         appear_video.play();
//         video.src = (window.URL || window.webkitURL).createObjectURL(stream);
//         video.play();
//       })
//       .catch(function (err) {
//         media = { video: true };
//         connectMachine(media);
//         // console.log(err);
//       });
//   }
// }

function getStyle(ele, name) {
  if (ele.style.styleFloat) {
    return ele.style.styleFloat; //ie下float处理
  } else if (ele.style.cssFloat) {
    return ele.style.cssFloat; //火狐等float处理
  }
  if (ele.currentStyle) {
    return ele.currentStyle[name];
  } else {
    return getComputedStyle(ele, false)[name];
  }
}
