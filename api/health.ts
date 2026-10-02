export default function handler(req: any, res: any) {
  res.status(200).json({ status: 'ok', app: 'BLVerse', version: '1.0.0' });
}
