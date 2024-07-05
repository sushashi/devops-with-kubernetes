# Part 4

## 4.01
[Source code](/Part4/Exercise4.01/)

Commands:
```console
$ k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
$ docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube
$ kubectl create namespace logoutput-pingpong
$ kubectl apply -f manifests
```

Decrypt secrets env variables and apply:
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

## 4.02
[Source code](/Part4/Exercise4.02/)

Commands:
```console
$ k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
$ docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube
$ kubectl create namespace project
$ kubectl apply -f manifests
```

Decrypt secrets env variables and apply:
```console
$ export SOPS_AGE_KEY_FILE=$(pwd)/key.txt
$ sops --decrypt secret.enc.yaml | kubectl apply -f -
```

- Test by deploying with wrong credentials. 
    ```console
        NAME                               READY   STATUS    RESTARTS      AGE
        todo-db-stset-0                    1/1     Running   0             104s
        todo-backend-dep-b875df87f-c42mj   0/1     Running   3 (27s ago)   2m8s
        project-dep-c4b8b675f-v9xgv        0/1     Running   4 (6s ago)    2m8s
    ```

## 4.03
- Query:

        sum(kube_pod_info{created_by_kind="StatefulSet", namespace="prometheus"})

## 4.04
[yaml files](/Part4/Exercise4.04/)

- install Prometheus
    ```console
    $ kubectl create namespace prometheus
    $ helm install prometheus-community/kube-prometheus-stack --generate-name --namespace prometheus
    $ kubectl get po -n prometheus
    $ kubectl -n prometheus port-forward prometheus-kube-prometheus-stack-1720-prometheus-0 9090:9090
    ```

- install Argo Rollouts
    ```console
    $ kubectl create namespace argo-rollouts
    $ kubectl apply -n argo-rollouts -f https://github.com/argoproj/argo-rollouts/releases/latest/download/install.yaml
    ```
- play around with rolling update
    - initially with the image `sushashu/todo-backend:v1.4`.
    - then `$ kubectl apply -f manifests/deployment-todos-backend.yaml` with the image `sushashu/todo-backend:v1.7`.
    - check what happens when you change different values such as `successCondition` in [analysistemplate.yaml](/Part4/Exercise4.04/manifests/analysistemplate.yaml).

## Notes

