import wixData from 'wix-data'
import wixLocation from 'wix-location'

// Referencia de la API de Velo: https://www.wix.com/velo/reference/api-overview/introduction

$w.onReady(function () {
  const dynamicPageId = $w('#dynamicDataset').getCurrentItem()._id
  wixData
    .query('Blog/Posts')
    .eq('_id', dynamicPageId)
    .find()
    .then((results) => {
      if (results.items.length > 0) {
        const post = results.items[0]
        const categoriesId = post.categories
        wixData
          .query('Blog/Categories')
          .hasSome('_id', categoriesId)
          .find()
          .then((categoriesResult) => {
            const categories = categoriesResult.items
            const options = categories.map((category) => {
              return { label: category.label, value: category.slug }
            })

            $w('#categoriesview').options = options

            $w('#categoriesview').onChange((e) => {
              const selectedID = e.target.value

              wixLocation.to(`/${selectedID}`)
            })
          })
          .catch((e) => {
            console.log(e)
          })
      }
    })
    .catch((err) => {
      console.log(err)
    })

  wixData
    .query('Publicidad')
    .hasSome('pages', ['Entradas'])
    .find()
    .then((res) => {
      if (res.items.length > 0) {
        const publicidad = res.items[0]

        $w('#anuncio').src = publicidad.image
        $w('#anuncio').link = publicidad.link
        $w('#anuncio').alt = publicidad.alt
        $w('#anuncio').target = '_blank'
        console.log(publicidad)
      }
    })
    .catch((e) => {
      console.log(e)
    })

  $w('#cover').fitMode = 'fit'
})
