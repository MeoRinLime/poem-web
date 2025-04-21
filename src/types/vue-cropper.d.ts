// 为 vue-cropper 提供类型声明
declare module 'vue-cropper' {
  import { Component } from 'vue'
  
  interface CropperOptions {
    img: string;
    outputSize?: number;
    outputType?: string;
    info?: boolean;
    canScale?: boolean;
    autoCrop?: boolean;
    autoCropWidth?: number;
    autoCropHeight?: number;
    fixed?: boolean;
    fixedNumber?: [number, number];
    full?: boolean;
    fixedBox?: boolean;
    canMove?: boolean;
    canMoveBox?: boolean;
    original?: boolean;
    centerBox?: boolean;
    high?: boolean;
    infoTrue?: boolean;
    maxImgSize?: number;
    enlarge?: number;
    mode?: string;
  }

  interface VueCropperMethods {
    startCrop(): void;
    stopCrop(): void;
    clearCrop(): void;
    refreshCrop(): void;
    rotate(deg: number): void;
    getCropBlob(callback: (blob: Blob) => void): void;
    getCropData(callback: (data: string) => void): void;
    getCropCanvas(callback: (canvas: HTMLCanvasElement) => void): void;
  }

  type VueCropperType = Component & VueCropperMethods;

  const VueCropper: VueCropperType;
  
  export default VueCropper;
}