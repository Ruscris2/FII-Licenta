"use strict";

export class Texture {
  Init(glContext, textureName) {
    this.texture = glContext.createTexture();
    glContext.bindTexture(glContext.TEXTURE_2D, this.texture);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_S, glContext.CLAMP_TO_EDGE);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_T, glContext.CLAMP_TO_EDGE);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.LINEAR);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.LINEAR);

    glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, glContext.RGBA, glContext.UNSIGNED_BYTE,
      document.getElementById(textureName));

    glContext.bindTexture(glContext.TEXTURE_2D, null);
  }

  SetActive(glContext) {
    glContext.bindTexture(glContext.TEXTURE_2D, this.texture);
  }

  SetInactive(glContext) {
    glContext.bindTexture(glContext.TEXTURE_2D, null);
  }
}
