// {
//   nomor: '001/B/SPO-RSIA/100124',
//   judul: 'SPO Pengambilan Darah Arteri (AGD)',
//   unit: 'Unit Rawat Inap, UGD',
//   tgl_terbit: '2024-01-10',
//   jenis: 'penunjang',
//   status: '1',
//   detail: {
//     nomor: '001/B/SPO-RSIA/100124',
//     pengertian: 
//       '&lt;p&gt;Pengambilan sampel AGD (Analisa gas darah) adalah suatu pengambilan sampel darah arteri yang di gunakan untuk mengukur kadar oksigen, karbondioksida, dan tingkat asam basa (pH) didalam darah.&lt;/p&gt;',
//     tujuan: 
//       '&lt;p&gt;Sebagai acuan dan langkah-langkah dalam pengambilan sampel darah arteri untuk pemeriksaan analisa gas darah.&lt;/p&gt;',
//     kebijakan: 
//       '&lt;ol&gt;&lt;li&gt;Peraturan Direktur Rumah Sakit&amp;nbsp;Ibu dan Anak Aisyiyah Pekajangan&amp;nbsp; No 026/A/SK-RSIA/010122&amp;nbsp;Tentang Kebijakan Pelayanan Rumah Sakit&amp;nbsp;Ibu dan Anak Aisyiyah Pekajangan.&lt;/li&gt;&lt;li&gt;SK Direktur Rumah Sakit Ibu dan Anak Aisyiyah&amp;nbsp;No. 061/A/SK-RSIA/010722&amp;nbsp;Tentang Kebijakan Pelayanan Instalasi Laboratorium&amp;nbsp;Rumah Sakit Umum Ibu dan Anak Aisyiyah Pekajangan.&lt;/li&gt;&lt;/ol&gt;',
//     prosedur: 
//       '&lt;ol&gt;&lt;li&gt;Petugas unit menginputkan permintaan AGD di SIMRS, kemudian menginformasikan kepada petugas laboratorium bahwa ada pasien yang akan dilakukan pemeriksaan analisa gas darah.&amp;nbsp;&lt;/li&gt;&lt;li&gt;Petugas laboratorium menghubungi laboratorium rujukan dan memastikan bahwa alat atau reagen di laboratorium rujukan ready untuk pemeriksaan. Serta memastikan kurir siap.&amp;nbsp;&lt;/li&gt;&lt;li&gt;Petugas laboratorium menyiapkan alat dan bahan yang di butuhkan pada saat pengambilan darah arteri.&amp;nbsp;&lt;/li&gt;&lt;li&gt;Gunakan APD Siapkan larutan heparin lalu sedot sebanyak&amp;nbsp;0,1ml, lalu bilas keseluruh spuit 3cc, usahakan tanpa gelembung.&lt;/li&gt;&lt;li&gt;Posisikan pasien pada posisi yang nyaman, cari atau raba pembuluh darah arteri, jika dirasa sudah yakin maka lakukan penusukan dg posisi jarum 450-900 (atau sesuaikan dengan lokasi penusukan).&lt;/li&gt;&lt;li&gt;Setelah sampel didapatkan tutup ujung jarum dengan karet khusus untuk menghindari adanya kontaminasi gas dari luar sampel, lalu sampel langsung dikirim ke laboratorium rujukan dilengkapi dengan data pasien (nama, tanggal lahir, alamat, DPJP, suhu pasien dan FiO2).&lt;/li&gt;&lt;/ol&gt;'
//   },
//   departemen: null
// }

import Image from "next/image"
import React from "react"
import he from 'he';


const SPOHtml = ({ data }: any) => {

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
    <>
      <div className="hidden md:block">
        <table className="w-full border-collapse border border-border tableSpo">
          <thead>
            <tr>
              <td rowSpan={2} className="border border-border p-5 text-center">
                <div className="w-full flex flex-col items-center justify-center gap-6">
                  <span className="text-center text-lg font-bold">
                    RSIA AISYIYAH PEKAJANGAN
                  </span>

                  <Image src="/static/logo.png" width={100} height={100} alt="Logo RSIA Aisyiyah Pekajangan" />
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
                  <Image src="/static/ttd-dr-him.jpeg" width={150} height={150} alt="Logo RSIA Aisyiyah Pekajangan" className="mx-auto" />
                  <span className="text-center font-bold underline -mt-5">dr. Himawan Budityastomo, Sp.OG</span>
                </div>
              </td>
            </tr>
            {/* loop detailSpo */}
            {detailSpo.map((item, index) => (
              <tr key={index}>
                <td className="border border-border p-5 text-center">
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
              <td className="border border-border p-5 text-center">
                <span className="font-bold">
                  UNIT TERKAIT
                </span>
              </td>
              <td colSpan={2} className="border border-border p-5">
                <ol className="list-decimal list-outside">
                  {data?.unit.split(',').map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ol>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="block md:hidden">
        {/* logo */} {/* Rsia Aisyiah Pekajangan*/}
        <div className="w-full flex items-center justify-center gap-6">
          <Image src="/static/logo.png" width={70} height={70} alt="Logo RSIA Aisyiyah Pekajangan" />
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
            {data?.unit.split(',').map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        </div>

        {/* ttd */}
        <div className="w-full flex flex-col items-center justify-center mt-4">
          <span className="text-center text-sm">Ditetapkan</span>
          <span className="text-center text-sm">Direktur RSIA Aisyiyah Pekajangan</span>
          <Image src="/static/ttd-dr-him.jpeg" width={150} height={150} alt="Logo RSIA Aisyiyah Pekajangan" />
          <span className="text-center font-bold underline -mt-5">dr. Himawan Budityastomo, Sp.OG</span>
        </div>
      </div>
    </>
  )
}

export default SPOHtml