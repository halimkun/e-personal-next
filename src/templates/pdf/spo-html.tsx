import Image from 'next/image';
import React from 'react';
import he from 'he';

interface SPOHtmlProps {
  data: any;
}

const SPOHtml = ({ data }: SPOHtmlProps) => {
  const detailSpo = ['pengertian', 'tujuan', 'kebijakan', 'prosedur'];

  function decodedHTML(htmlString: string): string | null {
    if (htmlString) {
      return he.decode(htmlString);
    }

    return null;
  }

  return (
    <div className='bg-background dark:bg-white dark:text-gray-900'>
      <div className='onPrint hidden md:block'>
        <table className='tableSpo w-full border-collapse border border-border'>
          <thead>
            <tr>
              <td rowSpan={2} className='border border-border p-5 text-center'>
                <div className='flex w-full flex-col items-center justify-center gap-6'>
                  <span className='text-center text-lg font-bold dark:text-gray-900'>
                    RSIA AISYIYAH PEKAJANGAN
                  </span>

                  <Image
                    src='/images/logo.png'
                    width={100}
                    height={100}
                    alt='Logo RSIA Aisyiyah Pekajangan'
                  />
                </div>
              </td>
              <td colSpan={2} className='border border-border text-center'>
                <span className='text-center text-xl font-bold dark:text-gray-900'>
                  {data?.judul}
                </span>
              </td>
            </tr>
            <tr>
              <td className='border border-border'>
                <div className='flex w-full flex-col gap-1'>
                  <span className='text-center text-sm dark:text-gray-900'>
                    No Dokumen :{' '}
                  </span>
                  <span className='text-center text-lg font-bold dark:text-gray-900'>
                    {data?.nomor}
                  </span>
                </div>
              </td>
              <td className='border border-border'>
                <div className='flex w-full flex-col gap-1'>
                  <span className='text-center text-sm dark:text-gray-900'>
                    Halaman :{' '}
                  </span>
                  <span className='text-center text-lg font-bold dark:text-gray-900'>
                    1/1
                  </span>
                </div>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='border border-border p-5 text-center'>
                <span className='text-lg font-bold dark:text-gray-900'>
                  STANDAR PROSEDUR OPERASIONAL
                </span>
              </td>
              <td className='border border-border'>
                <div className='flex w-full flex-col gap-1'>
                  <span className='text-center text-sm dark:text-gray-900'>
                    Tanggal Terbit :{' '}
                  </span>
                  <span className='text-center text-lg font-bold dark:text-gray-900'>
                    {new Date(data?.tgl_terbit).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </td>
              <td className='border border-border'>
                <div className='relative flex w-full flex-col gap-1'>
                  <span className='text-center text-sm dark:text-gray-900'>
                    Ditetapkan
                  </span>
                  <span className='text-center text-sm dark:text-gray-900'>
                    Direktur RSIA Aisyiyah Pekajangan
                  </span>
                  {data?.is_verified ? (
                    <Image
                      src='/images/ttd-dr-him.jpeg'
                      width={150}
                      height={150}
                      alt='Logo RSIA Aisyiyah Pekajangan'
                      className='mx-auto'
                    />
                  ) : (
                    <div className='my-10'></div>
                  )}
                  <span className='-mt-5 text-center font-bold underline dark:text-gray-900'>
                    dr. Himawan Budityastomo, Sp.OG
                  </span>
                </div>
              </td>
            </tr>
            {/* loop detailSpo */}
            {detailSpo.map((item, index) => (
              <tr key={index}>
                <td className='border border-border p-5 text-center align-top'>
                  <span className='font-bold dark:text-gray-900'>
                    {item.toUpperCase()}
                  </span>
                </td>
                <td
                  colSpan={2}
                  className='detail-spo border border-border p-5 dark:text-gray-900'
                  dangerouslySetInnerHTML={{
                    __html: decodedHTML(data?.detail[item]) as string,
                  }}
                ></td>
              </tr>
            ))}
            {/* end loop detailSpo */}
            {/* explode unit by , and loop  */}
            <tr>
              <td className='border border-border p-5 text-center align-top'>
                <span className='font-bold dark:text-gray-900'>
                  UNIT TERKAIT
                </span>
              </td>
              <td colSpan={2} className='border border-border p-5'>
                <ol className='list-outside list-decimal'>
                  {data?.unit_terkait
                    .split(',')
                    .map((item: string, index: number) => (
                      <li key={index} className='dark:text-gray-900'>
                        {item}
                      </li>
                    ))}
                </ol>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className='hideOnPrint block md:hidden'>
        {/* logo */} {/* Rsia Aisyiah Pekajangan*/}
        <div className='flex w-full items-center justify-center gap-6'>
          <Image
            src='/images/logo.png'
            width={70}
            height={70}
            alt='Logo RSIA Aisyiyah Pekajangan'
          />
          <span className='text-lg font-bold dark:text-gray-900'>
            RSIA AISYIYAH
            <br />
            PEKAJANGAN
          </span>
        </div>
        {/* judul */}
        <div className='mt-4 flex w-full items-center justify-center'>
          <span className='text-center text-xl font-bold dark:text-gray-900'>
            {data?.judul}
          </span>
        </div>
        {/* no dokumen, tanggal terbit */}
        <div className='items-left mt-4 flex w-full justify-between'>
          <div className='flex flex-col gap-1'>
            <span className='text-left text-sm dark:text-gray-900'>
              No Dokumen :{' '}
            </span>
            <span className='text-left text-sm font-bold dark:text-gray-900'>
              {data?.nomor}
            </span>
          </div>
          <div className='flex flex-col gap-1'>
            <span className='text-right text-sm dark:text-gray-900'>
              Tanggal Terbit :{' '}
            </span>
            <span className='text-right text-sm font-bold dark:text-gray-900'>
              {new Date(data?.tgl_terbit).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
        {/* detailSpo */}
        <div className='mt-4'>
          <span className='text text-left font-bold dark:text-gray-900'>
            STANDAR PROSEDUR OPERASIONAL
          </span>
          {detailSpo.map((item, index) => (
            <div
              key={index}
              className='tableSpo mt-2 flex w-full flex-col gap-1'
            >
              <span className='text-left text-sm font-bold dark:text-gray-900'>
                {item.toUpperCase()}
              </span>
              <div
                className='detail-spo text-left text-sm dark:text-gray-900'
                dangerouslySetInnerHTML={{
                  __html: decodedHTML(data?.detail[item]) as string,
                }}
              ></div>
            </div>
          ))}
        </div>
        {/* unit terkait */}
        <div className='tableSpo mt-2'>
          <span className='text text-left text-sm font-bold dark:text-gray-900'>
            UNIT TERKAIT
          </span>
          <ol className='list-outside list-decimal text-sm dark:text-gray-900'>
            {data?.unit_terkait
              .split(',')
              .map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
          </ol>
        </div>
        {/* ttd */}
        <div className='mt-4 flex w-full flex-col items-center justify-center'>
          <span className='text-center text-sm dark:text-gray-900'>
            Ditetapkan
          </span>
          <span className='text-center text-sm dark:text-gray-900'>
            Direktur RSIA Aisyiyah Pekajangan
          </span>
          <Image
            src='/images/ttd-dr-him.jpeg'
            width={150}
            height={150}
            alt='Logo RSIA Aisyiyah Pekajangan'
          />
          <span className='-mt-5 text-center font-bold underline dark:text-gray-900'>
            dr. Himawan Budityastomo, Sp.OG
          </span>
        </div>
      </div>
    </div>
  );
};

export default SPOHtml;
