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