import Image from "next/image"
import React from "react"
import he from 'he';

interface SPOHtmlProps {
  data: any
}

const SPOHtml = ({ data }: SPOHtmlProps) => {

  const detailSpo = [
    'pengertian',
    'tujuan',
    'kebijakan',
    'prosedur'
  ]

  function decodedHTML(htmlString: string): string | null {
    if (htmlString) {
      return he.decode(htmlString)
    }

    return null
  }

  return (
    <div className="bg-background dark:bg-background">
      <div className="hidden md:block onPrint">
        <table className="w-full border-collapse border border-border tableSpo">
          <thead>
            <tr>
              <td rowSpan={2} className="border border-border p-5 text-center">
                <div className="w-full flex flex-col items-center justify-center gap-6">
                  <span className="text-center text-lg font-bold">
                    RSIA AISYIYAH PEKAJANGAN
                  </span>

                  <Image src="/images/logo.png" width={100} height={100} alt="Logo RSIA Aisyiyah Pekajangan" />
                </div>
              </td>
              <td colSpan={2} className="border border-border text-center">
                <span className="text-center text-xl font-bold">
                  {data?.judul}
                </span>
              </td>
            </tr>
            <tr>
              <td className="border border-border">
                <div className="flex flex-col gap-1 w-full">
                  <span className="text-center text-sm">No Dokumen : </span>
                  <span className="text-center text-lg font-bold">
                    {data?.nomor}
                  </span>
                </div>
              </td>
              <td className="border border-border">
                <div className="flex flex-col gap-1 w-full">
                  <span className="text-center text-sm">Halaman : </span>
                  <span className="text-center text-lg font-bold">
                    1/1
                  </span>
                </div>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-border p-5 text-center">
                <span className="text-lg font-bold">
                  STANDAR PROSEDUR OPERASIONAL
                </span>
              </td>
              <td className="border border-border">
                <div className="w-full flex flex-col gap-1">
                  <span className="text-center text-sm">Tanggal Terbit : </span>
                  <span className="text-center text-lg font-bold">{
                    new Date(data?.tgl_terbit).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })
                  }</span>
                </div>
              </td>
              <td className="border border-border">
                <div className="w-full flex flex-col gap-1 relative">
                  <span className="text-center text-sm">Ditetapkan</span>
                  <span className="text-center text-sm">Direktur RSIA Aisyiyah Pekajangan</span>
                  {data?.is_verified ? (<Image src="/images/ttd-dr-him.jpeg" width={150} height={150} alt="Logo RSIA Aisyiyah Pekajangan" className="mx-auto" />) : (<div className="my-10"></div>)}
                  <span className="text-center font-bold underline -mt-5">dr. Himawan Budityastomo, Sp.OG</span>
                </div>
              </td>
            </tr>
            {/* loop detailSpo */}
            {detailSpo.map((item, index) => (
              <tr key={index}>
                <td className="border border-border p-5 text-center align-top">
                  <span className="font-bold">
                    {item.toUpperCase()}
                  </span>
                </td>
                <td colSpan={2} className="border border-border p-5" dangerouslySetInnerHTML={{ __html: decodedHTML(data?.detail[item]) as String }}></td>
              </tr>
            ))}
            {/* end loop detailSpo */}
            {/* explode unit by , and loop  */}
            <tr>
              <td className="border border-border p-5 text-center align-top">
                <span className="font-bold">
                  UNIT TERKAIT
                </span>
              </td>
              <td colSpan={2} className="border border-border p-5">
                <ol className="list-decimal list-outside">
                  {data?.unit_terkait.split(',').map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ol>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="block md:hidden hideOnPrint">
        {/* logo */} {/* Rsia Aisyiah Pekajangan*/}
        <div className="w-full flex items-center justify-center gap-6">
          <Image src="/images/logo.png" width={70} height={70} alt="Logo RSIA Aisyiyah Pekajangan" />
          <span className="text-lg font-bold">
            RSIA AISYIYAH<br />PEKAJANGAN
          </span>
        </div>

        {/* judul */}
        <div className="w-full flex items-center justify-center mt-4">
          <span className="text-center text-xl font-bold">
            {data?.judul}
          </span>
        </div>

        {/* no dokumen, tanggal terbit */}
        <div className="w-full flex items-left justify-between mt-4">
          <div className="flex flex-col gap-1">
            <span className="text-left text-sm">No Dokumen : </span>
            <span className="text-left text-sm font-bold">
              {data?.nomor}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-right text-sm">Tanggal Terbit : </span>
            <span className="text-right text-sm font-bold">{
              new Date(data?.tgl_terbit).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })
            }</span>
          </div>
        </div>


        {/* detailSpo */}
        <div className="mt-4">
          <span className="text-left text font-bold">STANDAR PROSEDUR OPERASIONAL</span>
          {detailSpo.map((item, index) => (
            <div key={index} className="w-full flex flex-col gap-1 mt-2 tableSpo">
              <span className="text-left text-sm font-bold">{item.toUpperCase()}</span>
              <div className="text-left text-sm" dangerouslySetInnerHTML={{ __html: decodedHTML(data?.detail[item]) as String }}></div>
            </div>
          ))}

        </div>

        {/* unit terkait */}
        <div className="mt-2 tableSpo">
          <span className="text-left text-sm text font-bold">UNIT TERKAIT</span>
          <ol className="list-decimal text-sm list-outside">
            {data?.unit_terkait.split(',').map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        </div>

        {/* ttd */}
        <div className="w-full flex flex-col items-center justify-center mt-4">
          <span className="text-center text-sm">Ditetapkan</span>
          <span className="text-center text-sm">Direktur RSIA Aisyiyah Pekajangan</span>
          <Image src="/images/ttd-dr-him.jpeg" width={150} height={150} alt="Logo RSIA Aisyiyah Pekajangan" />
          <span className="text-center font-bold underline -mt-5">dr. Himawan Budityastomo, Sp.OG</span>
        </div>
      </div>
    </div>
  )
}

export default SPOHtml