import React from 'react';
import { Page, Text, Image, View, Document, StyleSheet } from '@react-pdf/renderer';
import Html from 'react-pdf-html';


const styles = StyleSheet.create({
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "75%",
    borderStyle: "solid",
    borderWidth: 1,
  },
  tableCol1: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
  },
  tableCol2: {
    width: "50%",
    borderStyle: "solid",
    borderWidth: 1,
  },
  tableCol3: {
    width: "50%",
    borderStyle: "solid",
  },
  tableCell: {
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 5,
    fontSize: 12
  }
});

function decodeHtml(html) {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;

}

const PDFFile = ({ detail }) => (
  { detail } ? (
    <Document onContextMenu={(e) => e.preventDefault()}>
      <Page style={{
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35
      }}>
        <View style={{
          ...styles.table,
          marginBottom: '10px'
        }} fixed>
          <View style={styles.tableRow} >
            <View style={styles.tableCol1}>
              <View style={{
                width: "100%",
                padding: "15px 5px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: "10px"
              }}>
                <Text style={{
                  fontWeight: "bold",
                  textAlign: 'center',
                  fontSize: 12,
                  fontStyle: 'bold',
                }}>RSIA AISYIYAH PEKAJANGAN</Text>
                <Image
                  src="/static/logo.png"
                  style={{
                    width: "85px",
                    height: "auto",
                    borderRadius: "500px"
                  }}
                />
              </View>
            </View>
            <View style={styles.tableCol}>
              <View style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '115px',
                maxHeight: '125px',
                borderBottom: "1px solid #333",
                alignItems: 'center',
                textAlign: 'center',
                padding: "0px 10px",
                fontSize: 16
              }}>
                <Text>{detail.judul}</Text>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCol3}>
                  <View style={styles.tableCell}>
                    <Text style={{ fontSize: "10px", marginBottom: '5px' }}>No Dokumen :</Text>
                    <Text>{detail.nomor}</Text>
                  </View>
                </View>
                <View style={styles.tableCol3}>
                  <View style={{
                    ...styles.tableCell,
                    borderLeft: 1
                  }}>
                    <Text style={{ fontSize: "10px", marginBottom: '5px' }}>Halaman :</Text>
                    <Text style={{
                      fontSize: 12,
                    }} render={({ pageNumber, totalPages }) => (
                      `${pageNumber} / ${totalPages}`
                    )} />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={{
              ...styles.tableCol1,
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Text style={styles.tableCell}>
                STANDAR {"\n"} PROSEDUR {"\n"} OPERASIONAL
              </Text>
            </View>
            <View style={styles.tableCol}>
              <View style={styles.tableRow}>
                <View style={{
                  ...styles.tableCol3,
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <View style={styles.tableCell}>
                    <Text style={{ marginBottom: "5px", fontSize: "10px" }}>Tanggal diterbitkan :</Text>
                    <Text>{new Date(detail.tgl_terbit).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</Text>
                  </View>
                </View>
                <View style={{
                  ...styles.tableCol3,
                  borderLeft: 1
                }}>
                  <View style={{
                    ...styles.tableCell,
                    display: 'flex',
                    alignItens: 'center',
                    justifyContent: 'center'
                  }}>
                    <View style={{
                      width: "100%",
                      display: "flex",
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}>
                      <Text style={{
                        fontWeight: "bold",
                        textAlign: 'center',
                        fontSize: 10,
                        fontStyle: 'bold',
                      }}>Ditetapkan {"\n"} Direktur RSIA Aisyiyah Pekajangan</Text>
                      <Image
                        src="/static/ttd-dr-him.jpeg"
                        style={{
                          width: "100px",
                          height: "auto",
                          borderRadius: "500px"
                        }}
                      />
                      <Text style={{
                        fontWeight: "bold",
                        textAlign: 'center',
                        fontSize: 12,
                        fontStyle: 'bold',
                        textDecoration: 'underline',
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        left: 0,
                      }}>dr. Himawan Budityastomo, Sp.OG</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={{
              ...styles.tableCol1,
              display: 'flex',
              justifyContent: 'start',
              padding: 10
            }} wrapStyle={['paddingTop', 'borderTop', 'paddingBottom', 'borderBottom']}>
              <Text style={{
                ...styles.tableCell,
                textAlign: 'left'
              }}>
                Pengertian
              </Text>
            </View>
            <View style={styles.tableCol} wrapStyle={['paddingTop', 'borderTop', 'paddingBottom', 'borderBottom']}>
              <View style={{ padding: 10 }}>
                <Html style={{
                  ...styles.tableCell,
                  textAlign: 'left',
                }}>
                  {decodeHtml(detail.detail ? detail.detail.pengertian : '')}
                </Html>
              </View>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={{
              ...styles.tableCol1,
              display: 'flex',
              justifyContent: 'start',
              padding: 10
            }} wrapStyle={['paddingTop', 'borderTop', 'paddingBottom', 'borderBottom']}>
              <Text style={{
                ...styles.tableCell,
                textAlign: 'left'
              }}>
                Tujuan
              </Text>
            </View>
            <View style={styles.tableCol} wrapStyle={['paddingTop', 'borderTop', 'paddingBottom', 'borderBottom']}>
              <View style={{ padding: 10 }}>
                <Html style={{
                  ...styles.tableCell,
                  textAlign: 'left',
                }}>{decodeHtml(detail.detail ? detail.detail.tujuan : '')}</Html>
              </View>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={{
              ...styles.tableCol1,
              display: 'flex',
              justifyContent: 'start',
              padding: 10
            }} wrapStyle={['paddingTop', 'borderTop', 'paddingBottom', 'borderBottom']}>
              <Text style={{
                ...styles.tableCell,
                textAlign: 'left'
              }}>
                Kebijakan
              </Text>
            </View>
            <View style={styles.tableCol} wrapStyle={['paddingTop', 'borderTop', 'paddingBottom', 'borderBottom']}>
              <View style={{ padding: 0, }}>
                <Html
                  style={{
                    ...styles.tableCell,
                    textAlign: 'left',
                  }}>{decodeHtml(detail.detail ? detail.detail.kebijakan : '')}</Html>
              </View>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={{
              ...styles.tableCol1,
              display: 'flex',
              justifyContent: 'start',
              padding: 10
            }} wrapStyle={['paddingTop', 'borderTop', 'paddingBottom', 'borderBottom']}>
              <Text style={{
                ...styles.tableCell,
                textAlign: 'left'
              }}>
                Prosedur
              </Text>
            </View>
            <View style={styles.tableCol} wrapStyle={['paddingTop', 'borderTop', 'paddingBottom', 'borderBottom']}>
              <View style={{ padding: 0 }}>
                <Html style={{
                  ...styles.tableCell,
                  textAlign: 'left',
                }}>{decodeHtml(detail.detail ? detail.detail.prosedur : '')}</Html>
              </View>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={{
              ...styles.tableCol1,
              display: 'flex',
              justifyContent: 'start',
              padding: 10
            }} wrapStyle={['paddingTop', 'borderTop', 'paddingBottom', 'borderBottom']}>
              <Text style={{
                ...styles.tableCell,
                textAlign: 'left'
              }}>
                Unit Terkait
              </Text>
            </View>
            <View style={styles.tableCol} wrapStyle={['paddingTop', 'borderTop', 'paddingBottom', 'borderBottom']}>
              <Text style={{
                ...styles.tableCell,
                textAlign: 'left',
                padding: 10
              }}>
                ...
              </Text>
            </View>
          </View>

        </View>
      </Page>
    </Document>
  ) : (
    <Document></Document>
  )
)

// const PDFFile = ({ detail }) => (
//   <Document onContextMenu={(e) => e.preventDefault()}>
//     <Page size="A4" style={{
//       paddingTop: 35,
//       paddingBottom: 65,
//       paddingHorizontal: 35,
//       paddingLeft: 100,
//     }}>
//       <View style={{
//         width: "100%",
//         display: 'flex',
//         maxHeight: '160px',
//         flexDirection: 'row',
//       }}>
//         <View style={{
//           width: "40%",
//           border: "1px solid #333",
//           padding: "15px 5px",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           textAlign: "center",
//           gap: "10px"
//         }}>
//           <Text style={{
//             fontWeight: "bold",
//             textAlign: 'center',
//             fontSize: 12,
//             fontStyle: 'bold',
//           }}>RSIA AISYIYAH PEKAJANGAN</Text>
//           <Image
//             src="https://react-pdf.org/images/luke.jpg"
//             style={{
//               width: "80px",
//               height: "auto",
//               borderRadius: "500px"
//             }}
//           />
//         </View>

//         <View style={{
//           width: "100%",
//           display: "flex",
//         }}>
//           <View style={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             height: '115px',
//             maxHeight: '125px',
//             border: "1px solid #333",
//             alignItems: 'center',
//             textAlign: 'center',
//             padding: "0px 10px",
//             fontSize: 18
//           }}>
//             <Text>Koreksi Data Rekam Medis Elektronik</Text>
//           </View>
//           <View style={{
//             display: 'flex',
//             flexDirection: "row",
//             justifyItems: 'center',
//             alignItems: 'center',
//             textAlign: 'center',
//             fontSize: 20,
//             maxHeight: '45px',
//             height: '100%',
//           }}>
//             <View style={{
//               display: 'flex',
//               height: '100%',
//               border: "1px solid #333",
//               justifyContent: 'center',
//               alignItems: 'center',
//               textAlign: 'center',
//               fontSize: 12,
//               width: '100%',
//             }}>
//               <Text style={{
//                 marginBottom: '3px',
//                 fontStyle: 'bold',
//                 fontWeight: 'bold',
//               }}>No Dokumen :</Text>
//               <Text>015/C/SPO-RSIA/050123</Text>
//             </View>

//             <View style={{
//               display: 'flex',
//               border: "1px solid #333",
//               justifyContent: 'center',
//               alignItems: 'center',
//               textAlign: 'center',
//               fontSize: 12,
//               width: '100%',
//               height: '100%',
//             }}>
//               <Text style={{
//                 marginBottom: '3px',
//                 fontStyle: 'bold',
//                 fontWeight: 'bold',
//               }}>No Dokumen :</Text>
//               <Text style={{
//                 fontSize: 12,
//               }} render={({ pageNumber, totalPages }) => (
//                 `${pageNumber} / ${totalPages}`
//               )} />
//             </View>
//           </View>
//         </View>
//       </View>
//     </Page>
//   </Document>
// )

export default PDFFile;