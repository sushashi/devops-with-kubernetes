const k8s = require('@kubernetes/client-node');
const express = require('express');
const axios = require('axios');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const app = express();
PORT = process.env.PORT || 4000

let website = '<h1>No Website</h1>';
let nb_site = 0

const watch = new k8s.Watch(kc);
const api = "/apis/stable.dwk/v1/namespaces/website/dummysites"

const main = () => {
    watch.watch(api,
        {},
        async (type, apiObj, watchObj) => {
            
            if (type === 'ADDED') {
                nb_site += 1;
                console.log('New DummySite deployed:', apiObj.metadata.name);
                url = apiObj.spec.website_url;
                console.log('--url:', url);

                await grabWebsite(url)

                // console.log(website)

            } else if (type === 'MODIFIED') {
                console.log('DummySite modified:', apiObj.metadata.name);

            } else if (type === 'DELETED') {
                nb_site -= 1;
                console.log('DummySite deleted:', apiObj.metadata.name);
            }
            // console.log('ACTUAL URL: ', nb_site)
        },
        (err) => {
          console.error('Error watching DummySite:', err);
        }
      ).then((req) => {
        console.log('DummySite controller Watch initiated');
      });
}

const grabWebsite = async (url) => {
  const response = await axios.get(url);
  website = response.data
  // console.log(website)
};

app.get('/', (req, res) => {
  res.send(website)
})

app.listen(PORT, () => {
  console.log("DummySite controller serving on port", PORT)
})

main()