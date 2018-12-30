"use strict";

export class FramebufferPicking {
  Init(glContext, canvas) {
    this.frameBuffer = glContext.createFramebuffer();
    glContext.bindFramebuffer(glContext.FRAMEBUFFER, this.frameBuffer);

    this.textureColor = glContext.createTexture();
    glContext.bindTexture(glContext.TEXTURE_2D, this.textureColor);
    glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, canvas.width, canvas.height, 0, glContext.RGBA, glContext.UNSIGNED_BYTE, null);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.LINEAR);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.LINEAR);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_S, glContext.CLAMP_TO_EDGE);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_T, glContext.CLAMP_TO_EDGE);
    glContext.framebufferTexture2D(glContext.FRAMEBUFFER, glContext.COLOR_ATTACHMENT0, glContext.TEXTURE_2D, this.textureColor, 0);

    this.textureDepth = glContext.createRenderbuffer();
    glContext.bindRenderbuffer(glContext.RENDERBUFFER, this.textureDepth);
    glContext.renderbufferStorage(glContext.RENDERBUFFER, glContext.DEPTH_COMPONENT16, canvas.width, canvas.height);
    glContext.framebufferRenderbuffer(glContext.FRAMEBUFFER, glContext.DEPTH_ATTACHMENT, glContext.RENDERBUFFER, this.textureDepth);

    if(glContext.checkFramebufferStatus(glContext.FRAMEBUFFER) !== glContext.FRAMEBUFFER_COMPLETE) {
      console.error('Current picking Framebuffer attachment configuration is not supported!');
    }

    glContext.bindTexture(glContext.TEXTURE_2D, null);
    glContext.bindRenderbuffer(glContext.RENDERBUFFER, null);
    glContext.bindFramebuffer(glContext.FRAMEBUFFER, null);
  }

  ReadPixel(glContext, x, y) {
    var pixel = new Uint8Array(4);
    glContext.bindFramebuffer(glContext.FRAMEBUFFER, this.frameBuffer);
    glContext.readPixels(x, y, 1, 1, glContext.RGBA, glContext.UNSIGNED_BYTE, pixel);
    glContext.bindFramebuffer(glContext.FRAMEBUFFER, null);
    return pixel;
  }

  SetActive(glContext) {
    glContext.bindFramebuffer(glContext.FRAMEBUFFER, this.frameBuffer);
  }

  SetInactive(glContext) {
    glContext.bindFramebuffer(glContext.FRAMEBUFFER, null);
  }

  Clear(glContext) {
    glContext.bindFramebuffer(glContext.FRAMEBUFFER, this.frameBuffer);
    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
    glContext.bindFramebuffer(glContext.FRAMEBUFFER, null);
  }
}
