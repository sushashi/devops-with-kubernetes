# Part 4

## 4.01
[Source code](/Part4/Exercise4.01/)

- Commands:
    ```console
    $ k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
    $ docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube
    $ kubectl create namespace logoutput-pingpong
    $ kubectl apply -f manifests
    ```

- Decrypt secrets env variables and apply:
    ```console
    $ export SOPS_AGE_KEY_FILE=$(pwd)/key.txt
    $ sops --decrypt secret.enc.yaml | kubectl apply -f -
    ```
- Before the database is available:
    ```console
    $ kubectl get po
        NAME                                                      READY   STATUS    RESTARTS   AGE
        nginx-ingress-ingress-nginx-controller-7b6bf7f4cd-9gnd7   1/1     Running   0          2m32s
        pingpong-8559765657-k48rd                                 0/1     Running   0          111s
        splitted-logoutput-66d4d67fb7-tll9h                       1/2     Running   0          111s
    ```
- Adding the database:
    ```console
    $ kubectl apply -f statefulset-psql.yaml
    $ kubectl get po
        NAME                                                      READY   STATUS    RESTARTS   AGE
        nginx-ingress-ingress-nginx-controller-7b6bf7f4cd-9gnd7   1/1     Running   0          3m18s
        psql-stset-0                                              1/1     Running   0          31s
        pingpong-8559765657-k48rd                                 1/1     Running   0          2m37s
        splitted-logoutput-66d4d67fb7-tll9h                       2/2     Running   0          2m37s
    ```

## 4.02 Project v1.7
[Source code](/Part4/Exercise4.02/)

- Commands:
    ```console
    $ k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
    $ docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube
    $ kubectl create namespace project
    $ kubectl apply -f manifests
    ```

- Decrypt and deploy secrets env variables:
    ```console
    $ export SOPS_AGE_KEY_FILE=$(pwd)/key.txt
    $ sops --decrypt secret.enc.yaml | kubectl apply -f -
    ```

- Test by deploying with wrong credentials:
    ```console
    NAME                               READY   STATUS    RESTARTS      AGE
    todo-db-stset-0                    1/1     Running   0             104s
    todo-backend-dep-b875df87f-c42mj   0/1     Running   3 (27s ago)   2m8s
    project-dep-c4b8b675f-v9xgv        0/1     Running   4 (6s ago)    2m8s
    ```

## 4.03 Prometheus
- Query:

        sum(kube_pod_info{created_by_kind="StatefulSet", namespace="prometheus"})

## 4.04 Project v1.8
[yaml files](/Part4/Exercise4.04/)

- Install Prometheus:
    ```console
    $ kubectl create namespace prometheus
    $ helm install prometheus-community/kube-prometheus-stack --generate-name --namespace prometheus
    $ kubectl get po -n prometheus
    $ kubectl -n prometheus port-forward prometheus-kube-prometheus-stack-1720-prometheus-0 9090:9090
    ```

- Install Argo Rollouts:
    ```console
    $ kubectl create namespace argo-rollouts
    $ kubectl apply -n argo-rollouts -f https://github.com/argoproj/argo-rollouts/releases/latest/download/install.yaml
    ```
- Play around with rolling update:
    - initially with the image `sushashu/todo-backend:v1.4`.
    - then `$ kubectl apply -f manifests/deployment-todos-backend.yaml` with the image `sushashu/todo-backend:v1.7`.
    - check what happens when you change different values such as `successCondition` in [analysistemplate.yaml](/Part4/Exercise4.04/manifests/analysistemplate.yaml).

## 4.05 Project v1.9
[Source code](/Part4/Exercise4.05/)

Implemented:
- Handle 'Done' todos [project](/Part4/Exercise4.05/project/).
- PUT request to `/todos/<id>` in [todo-backend](/Part4/Exercise4.05/todo-backend/).
- Database adaptation: `done` attribute.

Commands:
- Create cluster and deploy:
    ```console
    $ k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
    $ docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube
    $ kubectl create namespace logoutput-pingpong
    $ kubectl apply -f manifests
    ```

- Decrypt and deploy secrets env variables:
    ```console
    $ export SOPS_AGE_KEY_FILE=$(pwd)/key.txt
    $ sops --decrypt secret.enc.yaml | kubectl apply -f -
    ```

### Note to self:
- Database testing with docker:
    ```console
    $ docker build . -t sushashu/todo-db:4.05
    $ docker run -d --name todo-db-container -e POSTGRES_PASSWORD=test -p 5432:5432 sushashu/todo-db:4.05
    ```

## 4.06 Project v2.0
[Source code](/Part4/Exercise4.06/)

Implemented:
- [Broadcaster service](/Part4/Exercise4.06/todo-broadcaster/).
- Posting on Discord.

Commands:
- Start cluster:
    ```console
    $ k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
    $ docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube
    $ kubectl create namespace project
    ```
- Install Prometheus (for analytics from previous exercise):
    ```console
    $ kubectl create namespace prometheus
    $ helm install prometheus-community/kube-prometheus-stack --generate-name --namespace prometheus
    $ kubectl get po -n prometheus
    $ kubectl -n prometheus port-forward prometheus-kube-prometheus-stack-1720-prometheus-0 9090:9090
    ```

- Install NATS:
    ```console
    $ helm install --set auth.enabled=false my-nats oci://registry-1.docker.io/bitnamicharts/nats
    ```

- Install Argo Rollouts:
    ```console
    $ kubectl create namespace argo-rollouts
    $ kubectl apply -n argo-rollouts -f https://github.com/argoproj/argo-rollouts/releases/latest/download/install.yaml
    ```

- Decrypt and deploy secrets env variables:
    ```console
    $ export SOPS_AGE_KEY_FILE=$(pwd)/key.txt
    $ sops --decrypt secret.enc.yaml | kubectl apply -f -
    ```
- Deploy everything:
    ```console
    $ kubectl apply -f manifests
    ```
    - Visit http://127.0.0.1:8081/
    - Check logs
    - Check Discord fullstack_webhook

### Note to self:
- Database for dev:

        $ docker run -p 5432:5432 -d -e POSTGRES_PASSWORD=test --name todo-db-container sushashu/todo-db:4.05

- NATS for dev:

        $ docker run -p 4222:4222 -p 8222:8222 -p 6222:6222 --name nats-server -ti nats:latest

- Secret.yaml encryption:
    ```console
    $ sops --encrypt \
      --age age12p9wfqn70au3fmj6fvey8ykkhfc2qd6spznzxtzfp7p5qv2rnf0qnjqhkx \
      --encrypted-regex '^(stringData)$' \
      secret.yaml > secret.enc.yaml
    ```
    > using `stringData` because `DISCORD_URL` is not base64

## 4.07
[Source code](/Part4/Exercise4.07/)

[Github workflow file](/.github/workflows/main-exercise4.07.yaml)

- Create GKE Cluster:
    ```console
    $ gcloud container clusters create dwk-cluster --zone=europe-north1-b --cluster-version=1.29
    ```
    
- Setup ArgoCD:
    ```console
    $ kubectl create namespace argocd
    $ kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
    $ kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'
    $ kubectl get svc -n argocd
    $ kubectl get -n argocd secrets argocd-initial-admin-secret -o yaml
    ```
    > password is in base64

- Create namespace and install dependencies (nginx):
    ```console
    $ kubectl create namespace logoutput-pingpong
    $ kubens logoutput-pingpong
    $ helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
    $ helm repo update
    $ helm install nginx-ingress ingress-nginx/ingress-nginx
    ```

- Login ArgoCD with IP address from `$ kubectl get svc`.
- Create *Ping-pong app* in ArgoCD.
- Commit some changes with the *Ping-pong app* and see the automated update.

## 4.08

[Source code](/Part4/Exercise4.08/codes/)

[Manifests overlays](/Part4/Exercise4.08/manifests-overlays/)

[Github workflow file](/.github/workflows/main-exercise4.08.yaml)

- Start GKE cluster:
    ```console
    $ gcloud container clusters create dwk-cluster --zone=europe-north1-b --cluster-version=1.29
    ```


- Install Prometheus (analytics used for rolling update: "cpu-usage-rate"):
    ```console
    $ kubectl create namespace prometheus
    $ helm install prometheus-community/kube-prometheus-stack --generate-name --namespace prometheus
    $ kubectl get po -n prometheus
    ```
    > Check for the correct `prometheus-kube-prometheus-stack` pod used by `analysistemplate.yaml`

- Install Argo Rollouts (for canary rollout):
    ```console
    $ kubectl create namespace argo-rollouts
    $ kubectl apply -n argo-rollouts -f https://github.com/argoproj/argo-rollouts/releases/latest/download/install.yaml
    ```

- Install and setup ArgoCD
    ```console
    $ kubectl create namespace argocd
    $ kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
    $ kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'
    $ kubectl get svc -n argocd
    $ kubectl get -n argocd secrets argocd-initial-admin-secret -o yaml
    ```
    > password is in base64

- Login ArgoCD with IP address from `$ kubectl get svc`.

- Create namespace for `staging` and `production` environment:
    ```console
    $ kubectl create namespace staging
    $ kubectl create namespace production
    ```

- Install NATS in both environment:
    ```console
    $ helm install --set auth.enabled=false my-nats oci://registry-1.docker.io/bitnamicharts/nats
    ```
- Decrypt and apply secrets.yaml in both environment.

- Prepare Persistent Volume in GKE supporting ReadWriteMany:
    ```console
    $ gcloud compute disks create --size=1GB --zone=europe-north1-b nfs-disk01
    $ gcloud compute disks create --size=1GB --zone=europe-north1-b nfs-disk02
    $ kubectl create namespace nfs-server
   $ kubectl apply -n nfs-server -f /nfs-server/

    ```

- Deploy the application in their environment:
    ```console
    $ kubens staging
    $ kubectl apply -f staging.yaml
    $ kubens production
    $ kubectl apply -f production.yaml
    ```



- Wait to get IP addresses ...
- Play around:
    - A `#prod` commit results in deployment in the production environment, without *tag* in the staging environment.
    - In the production environment, creating and marking *todos* are forwarded to Discord, whereas in the staging environment, it is only logged in the console.


### Note to self:
- I use the normal Ingress controller instead of [Ingress-Nginx](https://kubernetes.github.io/ingress-nginx/) because I am not able to get two different IP adresses assigned on two different namespaces (environments). (Further investigation about "external" LoadBalancer and IngressClass ..)

- Yaml for Ingress-Nginx installation:
    ```console
    $ kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.1/deploy/static/provider/cloud/deploy.yaml
    ```

- Explanation to set up a NFS-Server in order to have a Rolling update that works in GKE using ReadWriteMany as AccessMode in persistent volumes. [Medium Link](https://medium.com/@Sushil_Kumar/readwritemany-persistent-volumes-in-google-kubernetes-engine-a0b93e203180)

## Notes

- To delete GKE cluster:
    ```
    $ gcloud container clusters delete dwk-cluster --zone=europe-north1-b
    ```

- There seems to be some remaining problem with rolling updates and storage in GKE. (PVC and Multiple pods prior to ex 4.08)

- Make a pull in VSCode after the push since there is a commit ahead because GitHub Workflow also makes a commit after the initial push. (Ex 4.07 and 4.08)