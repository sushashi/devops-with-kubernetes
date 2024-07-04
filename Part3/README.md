# Part 3

## 3.01 Pingpong GKE
[Source code](/Part3/Exercise3.01/)

- Preliminary commands/authentification:
    ```console
    $ gcloud auth login$
    $ gcloud config set dwk-gke-427507
    $ gcloud services enable container.googleapis.com
    ```
- Create cluster:
    ```console
    $ gcloud container clusters create dwk-cluster --zone=europe-north1-b --cluster-version=1.29
    $ gcloud container clusters get-credentials dwk-cluster --zone=europe-north1-b
    ```

- Deploy and get IP
    ```console
    $ kubectl create namespace pingpong
    $ kubectl apply -f manifests
    $ export SOPS_AGE_KEY_FILE=$(pwd)/key.txt
    $ sops --decrypt secret.enc.yaml | kubectl apply -f -
    $ kubens pingpong
    $ kubectl get svc
    ```
- Visit http://{External-IP of pingpong-svc}/pingpong

## 3.02 Back to Ingress

[Source code](/Part3/Exercise3.02/)

- Modify pingpong to respond something from the path /
- Deploy and get IP
    ```console
    $ kubectl create namespace logoutput-pingpong
    $ kubectl apply -f manifests
    $ export SOPS_AGE_KEY_FILE=$(pwd)/key.txt
    $ sops --decrypt secret.enc.yaml | kubectl apply -f -
    $ kubens logoutput-pingong
    $ kubectl get ing
    ```
- Wait **5 minutes** !
- Visit http://{Ingress ip address}/pingpong 
- visit http://{Ingress ip address}

## 3.03 Project v1.4

[Source code](/Part3/Exercise3.03/)

[Github Actions workflow](/.github/workflows/main-exercise3.03.yaml)

- Push to github and check github actions.
- Wait 5-10min, run `kubectl get ing` and visit http://{Ingress ip address}

#### Note to self:
- Decrypt secret is placed before kustomize namespace in workflow.
- `kustomization.yaml` includes `secret.yaml` in resources, the file is generated in Decrypt step.

## 3.04 Project v1.41

[Source code](/Part3/Exercise3.04/)

[Github Actions Workflow](/.github/workflows/main-exercise3.04.yaml)

- Create a new branch and push something.
- Check on Github Actions and GKE (with `kubens` for example).
- Wait 5-10min and visit http://{Ingress ip address}

#### Note to self: 
- Namespace has to be in lowercase.

## 3.05 Project v1.42
[Source code (from 3.04)](/Part3/Exercise3.04/)

[Github Actions Workflow](/.github/workflows/delete-exercise3.05.yaml)

- Commands:
    ```console
    $ git checkout main
    $ git push origin --delete <branch-name>
    $ git branch -D <branch-name>
    ```
- Check on Github Actions and GKE (with `kubens` for example) to confirm namespace deletion.

#### Note to self:
- `github.event.ref` to get the branch name.

## 3.06 DBaas vs DIY

### DaaS (Database as a Service)

The main advantage of using a DBaaS (Database as a service) such as Google Cloud SQL is that it offers a quick and easy deployment with minimal effort. It also offers many ready to use services such as backups, data encryption, replication, maintenance, updates, monitoring and so on. 

These services are implemented by experts using the latest technologies using the most robust security standards and is often well documented.

DaaS are cost-effective since it eliminates an upfront investment in physical infrastructure and configuration by hiring experts.

On the other hand, the main disadvantage of a DBaaS is that we don’t have any control over the server, we depend entirely on the provider. They can lock up our data due to some policy changes or government decision. They can also lose them due to some hardware failures.
Moreover, it can get expensive fast if we have an increase of data storage needs or data replications for redundancy for example.

### DIY (Do it yourself) database:

Comparing to a DIY (Do it yourself) database, we have a full control over the infrastructure, the software and data management, but most importantly, we own our data.
We can tailor the database to our specific needs and preferences such as customized backup methods or database replication in our own infrastructure. It is potentially more cost effective if we need a big in-house database.

On the other hand, one of the disadvantages is that it is more costly to acquire all the infrastructure and to hire experts. Moreover, developing, configuring and maintaining an in-house database is not a simple task, it requires a lot of experts in diverse domain and may be really time consuming. Moreover, a simple mistake can lead to huge damage.

## 3.07 
[Source code](/Part3/Exercise3.07/)

- The shell script is based on a CURL POST command explained by google [here](https://cloud.google.com/storage/docs/authentication)
- Use `$ gcloud auth print-access-token` to generate a token and update the file secret.yaml

#### Note to self:
- Note that the token is only valid 3600 seconds. I should consider an authentification method as explained in the course for github-actions.
- Also note that postgres images and versions has to match to execute PG_DUMP.
- Also note that secrets string data has to be base64. (`stringData` does not get encrypted compared to `data` in `secret.yaml`!)

## 3.08 Project v1.5
[manifests yaml files](/Part3/Exercise3.08/)
- Played around with resource limits.

## 3.09
[manifests yaml files](/Part3/Exercise3.09/)
- Played around with resource limits.
## 3.10 Project v1.6
- Activate `Cloud Logging API`
- Go to Logs Explorer

![screenshot](/Part3/Exercise3.10/Exercise_3.10_Screenshot%202024-07-03.jpg)


## Notes

- Delete cluster with:
    ```console
    $ gcloud container clusters delete dwk-cluster --zone=europe-north1-b
    ```
- Service Account Key of Google Cloud Services:
    - Follow this guide : [here](https://cloud.google.com/iam/docs/keys-create-delete)
    - Create a service account for GKE called 'github-actions' for the project [here](https://console.cloud.google.com/projectselector2/iam-admin/serviceaccounts?supportedpurview=project)
    - Create the Key with gcloud (.json file):
        ```console
        $ gcloud iam service-accounts keys create ./private-key.json --iam-account=github-actions@<PROJECT-NAME-ID>.iam.gserviceaccount.com
        ```