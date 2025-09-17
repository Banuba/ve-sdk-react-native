export class TrackData {
  id: string;
  title: string;
  subtitle: string;
  localUrl: string;

  constructor({
    id,
    title,
    subtitle,
    localUrl,
  }: {
    id: string;
    title: string;
    subtitle: string;
    localUrl: string;
  }) {
    this.id = id;
    this.title = title;
    this.subtitle = subtitle;
    this.localUrl = localUrl;
  }
}
