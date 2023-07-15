onUiLoaded(function () {
  let imageContainer = document.getElementById("lightboxModal");
  imageContainer.style.width = "100%";
  imageContainer.style.height = "100%";
  imageContainer.style.overflow = "hidden";
  function disableClose(e) {
    e.stopPropagation();
  }
  let modalControls = imageContainer.getElementsByClassName("modalControls")[0];
  if (modalControls) {
    modalControls.style.position = "relative";
    modalControls.style.zIndex = 1;
  }
  let img = imageContainer.querySelector("img");
  img.style.width = "auto";
  let scale = 1;
  let lastX = 0;
  let lastY = 0;
  let offsetx = 0;
  let offsety = 0;
  let isDragging = false;
  let touchStore = {};
  let event = {
    wheel: function (event) {
      img.style.transition = "transform 0.3s ease";
      event.stopPropagation();
      event.preventDefault();
      let delta = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail));
      let zoomStep = 0.1;
      let zoom = 1 + delta * zoomStep;
      scale *= zoom;
      lastX *= zoom;
      lastY *= zoom;
      img.style.transform =
        "translate(" + offsetx + "px, " + offsety + "px) scale(" + scale + ")";
    },
    mousedown: function (event) {
      event.stopPropagation();
      isDragging = true;
      lastX = event.clientX - offsetx;
      lastY = event.clientY - offsety;
      img.style.cursor = "grabbing";
    },
    mousemove: function (event) {
      img.style.transition = "";
      event.stopPropagation();
      event.preventDefault();
      if (isDragging) {
        img.onclick = disableClose;
        let deltaX = event.clientX - lastX;
        let deltaY = event.clientY - lastY;
        offsetx = deltaX;
        offsety = deltaY;
        img.style.transform =
          "translate(" + deltaX + "px, " + deltaY + "px) scale(" + scale + ")";
      }
    },
    mouseup: function (event) {
      event.stopPropagation();
      isDragging = false;
      img.style.cursor = "grab";
    },
    mouseleave: function (event) {
      event.stopPropagation();
      isDragging = false;
      img.style.cursor = "grab";
    },
    reset() {
      scale = 1;
      lastX = 0;
      lastY = 0;
      last2X = 0;
      last2Y = 0;
      offsetx = 0;
      offsety = 0;
      touchStore = {};
      img.style.transform = "none";
      img.onclick = undefined;
    },
    touchcancel: function (event) {
      event.stopPropagation();
      event.preventDefault();
      img.onclick = undefined;
      img.style.transition = "";
      // 获取手势缩放比例
      let newScale = scale * event.scale;
      // 设置img标签的样式，实现缩放效果
      img.style.transform =
        "translate(" + offsetx + "px, " + offsety + "px) scale(" + scale + ")";
    },
    touchend: function (event) {
      // 更新缩放比例
      event.stopPropagation();
      img.onclick = undefined;
      scale = scale * event.scale;
    },
    touchstart: function (event) {
      event.stopPropagation();
      if (!touchStore.tpuchScale) {
        lastX = event.targetTouches[0].pageX - offsetx;
        lastY = event.targetTouches[0].pageY - offsety;
      }
      touchStore.tpuchScale = false;
      if (event.targetTouches[1]) {
        touchStore.tpuchScale = true;
        touchStore.last1X = event.targetTouches[0].pageX;
        touchStore.last1Y = event.targetTouches[0].pageY;
        touchStore.last2X = event.targetTouches[1].pageX;
        touchStore.last2Y = event.targetTouches[1].pageY;
        touchStore.scale = scale;
      }
    },
    touchmove: function (event) {
      event.stopPropagation();
      event.preventDefault();
      img.onclick = disableClose;
      img.style.transition = "";
      let deltaX = event.targetTouches[0].pageX - lastX;
      let deltaY = event.targetTouches[0].pageY - lastY;
      if (event.targetTouches[1]) {
        img.style.transition = "transform 0.3s ease";
        touchStore.delta1X = event.targetTouches[0].pageX;
        touchStore.delta1Y = event.targetTouches[0].pageY;
        touchStore.delta2X = event.targetTouches[1].pageX;
        touchStore.delta2Y = event.targetTouches[1].pageY;
        let lastLen = Math.sqrt(
          Math.pow(touchStore.last2X - touchStore.last1X, 2) +
            Math.pow(touchStore.last2Y - touchStore.last1Y, 2)
        );
        let deltaLen = Math.sqrt(
          Math.pow(touchStore.delta2X - touchStore.delta1X, 2) +
            Math.pow(touchStore.delta2Y - touchStore.delta1Y, 2)
        );
        let zoom = deltaLen / lastLen;
        scale = touchStore.scale * zoom;
        deltaX *= zoom;
        deltaY *= zoom;
      } else if (touchStore.tpuchScale) {
        touchStore.tpuchScale = false;
        img.style.transition = "transform 0.3s ease";
      }
      offsetx = deltaX;
      offsety = deltaY;
      img.style.transform =
        "translate(" + deltaX + "px, " + deltaY + "px) scale(" + scale + ")";
    },
  };

  function reloadZoomEvent(new_event) {
    if (!new_event) return;
    imageContainer.removeEventListener("click", event.reset);
    imageContainer.removeEventListener("wheel", event.wheel);
    img.removeEventListener("mousedown", event.mousedown);
    img.removeEventListener("mousemove", event.mousemove);
    img.removeEventListener("mouseup", event.mouseup);
    img.removeEventListener("mouseleave", event.mouseleave);
    // 移动端
    img.removeEventListener("touchstart", event.touchstart);
    img.removeEventListener("touchmove", event.touchmove);
    event = new_event;

    imageContainer.addEventListener("click", event.reset);
    imageContainer.addEventListener("wheel", event.wheel);
    img.addEventListener("mousedown", event.mousedown);
    img.addEventListener("mousemove", event.mousemove);
    img.addEventListener("mouseup", event.mouseup);
    img.addEventListener("mouseleave", event.mouseleave);
    // 移动端
    img.addEventListener("touchstart", event.touchstart);
    img.addEventListener("touchmove", event.touchmove);
  }
  reloadZoomEvent(event);
});
