export class ExportData {
  exportedVideos: ExportedVideo[];
  watermark: Watermark | null;

  constructor({
    exportedVideos,
    watermark = null,
  }: {
    exportedVideos: ExportedVideo[];
    watermark?: Watermark | null;
  }) {
    this.exportedVideos = exportedVideos;
    this.watermark = watermark;
  }
}

export enum VideoResolution {
  vga360p = 'vga360p',
  vga480p = 'vga480p',
  qhd540p = 'qhd540p',
  hd720p = 'hd720p',
  fhd1080p = 'fhd1080p',
  qhd1440p = 'qhd1440p',
  uhd2160p = 'uhd2160p',
  auto = 'auto',
  original = 'original',
}

export class ExportedVideo {
  fileName: string;
  videoResolution: VideoResolution;
  useHevcIfPossible: boolean | null;

  constructor({
    fileName,
    videoResolution,
    useHevcIfPossible = null,
  }: {
    fileName: string;
    videoResolution: VideoResolution;
    useHevcIfPossible?: boolean | null;
  }) {
    this.fileName = fileName;
    this.videoResolution = videoResolution;
    this.useHevcIfPossible = useHevcIfPossible;
  }
}

export enum WatermarkAlignment {
  topLeft = 'topLeft',
  topRight = 'topRight',
  bottomLeft = 'bottomLeft',
  bottomRight = 'bottomRight',
}

export class Watermark {
  imagePath: string;
  alignment: WatermarkAlignment | null;
  width?: number | undefined;
  height?: number | undefined;

  constructor({
    imagePath,
    alignment = null,
    width,
    height,
  }: {
    imagePath: string;
    alignment?: WatermarkAlignment | null;
    width?: number;
    height?: number;
  }) {
    this.imagePath = imagePath;
    this.alignment = alignment;
    this.width = width;
    this.height = height;
  }
}
