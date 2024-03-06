import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

const saveAsPdf = async (url: string, token?: string) => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: 'new',
  });
  const page = await browser.newPage();

  const urlToken = `${url}?token=${token}`;

  await page.goto(urlToken, {
    waitUntil: 'networkidle0',
  });

  const result = await page.pdf({
    format: 'a4',
  });
  await browser.close();

  return result;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { url, token } = req.query; // pass the page to create PDF from as param

  // get data dulu disini baru di pass ke saveAsPdf sebagai url params

  res.setHeader('Content-Disposition', `attachment; filename="file.pdf"`);
  res.setHeader('Content-Type', 'application/pdf');

  const pdf = await saveAsPdf(url as string, token as string);

  return res.send(pdf);
};
