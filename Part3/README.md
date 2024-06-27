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