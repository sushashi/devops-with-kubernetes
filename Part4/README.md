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

## Notes

