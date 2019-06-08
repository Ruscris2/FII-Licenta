
export default class SceneManager {
  NewTexture(textureName): any;
  ChangeTool(toolIndex): any;
  MapUpdateLayerListEvent(updateLayerListEvent): any;
  MapChangeToolFunc(changeToolFunc): any;
  MapImageCapturedEvent(imageCapturedEvent): any;
  MoveLayer(id, directionUp): any;
  DeleteLayer(id): any;
  SetSelectedLayer(id): any;
  AdjustColor(id, hue, saturation, brightness): any;
  AdjustOverlay(id, enabled, r, g, b): any;
  AdjustOpacity(id, opacity): any;
  AddNewLayer(): any;
  ToggleHelpers(toggle): any;
  NewObject3D(objData): any;
}
