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

## 4.07

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

- Create namespace and install dependencies:
    ```console
    $ kubectl create namespace logoutput-pingpong
    $ kubens logoutput-pingpong
    $ helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
    $ helm repo update
    $ helm install nginx-ingress ingress-nginx/ingress-nginx
    ```

- Login ArgoCD with IP address from `$ kubectl get svc`
- Create application ...








- On local k3d you may want to forward port:
    ```
    $ kubectl port-forward svc/argocd-server -n argocd 8080:443
    ```
- Password is in base64

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

## Notes