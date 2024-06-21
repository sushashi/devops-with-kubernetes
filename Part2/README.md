# Part 2

## 2.01 logoutput & pingpong

[Source code](/Part2/Exercise2.01/)

Commands:
```console
$ k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
$ docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube1
$ docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube2
$ kubectl apply -f manifests
```

Then visit:
- http://localhost:8081/pingpong to increase pong counter.
- http://localhost:8081 to display timestamp hash and pong counter.

Notes:
- I maintained a separate persistent volume for each application (logoutput write and read / pingpong counter).
- If we undeploy pingpong we receive `Ping / Pongs: undefined` on the second line.
- Redeploying again gives us the last pingpong count (persistent volume).

## 2.02 project v1.0
[Source code](/Part2/Exercise2.02/)

Commands:
```console
$ k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
$ docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube
$ kubectl apply -f manifests
```

Then visit
- http://localhost:8081

## 2.03 logoutput & pingpong
[Source code](/Part2/Exercise2.03/)

Commands:
```console
$ k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
$ docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube1
$ docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube2
$ kubectl create namespace logoutput-pingpong
$ kubectl apply -f manifests
```

## 2.04 project v.1.1
[Source code](/Part2/Exercise2.04/)

Commands:
```console
$ k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
$ docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube
$ kubectl create namespace project
$ kubectl apply -f manifests
```

## 2.05 secrets

[Training files](/Part2/Exercise2.05)

Summary of steps from lecture notes:

1. Generate key-pair
    ```console
    $ age-keygen -o key.txt
        age-keygen: warning: writing secret key to a world-readable file
        Public key: age1dl9sw7cwzqetgtt2me5n7vrr8m6jg7leyw7y5vhs2le5kx267dnq4sg5fp
    ```
2. Use public key to encrypt the value in the file secret.yaml to encrypted yaml file secret.enc.yaml
    ```console
    $ sops --encrypt \
        --age age1dl9sw7cwzqetgtt2me5n7vrr8m6jg7leyw7y5vhs2le5kx267dnq4sg5fp \
        --encrypted-regex '^(data)$' \
        secret.yaml > secret.enc.yaml
    ```
3. In order to decrypt a secret.enc.yaml, export the key file in `SOPS_AGE_KEY_FILE`, then decrypt
    ```console
    $ export SOPS_AGE_KEY_FILE=$(pwd)/key.txt
    $ sops --decrypt secret.enc.yaml > secret.yaml
    ```
4. Or apply directly via piping
    ```console
    $ sops --decrypt secret.enc.yaml | kubectl apply -f -
    ```

## 2.06 logoutput & pingpong
[Source code](/Part2/Exercise2.06/)

- Added `configmap.yaml`.
- Modification of `deployment.yaml` to use `ConfigMap` data.

Commands:
```console
$ k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
$ docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube1
$ docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube2
$ kubectl create namespace logoutput-pingpong
$ kubectl apply -f manifests
```

## 2.07 logoutput & pingpong & postgres

[Source code](/Part2/Exercise2.07/)

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
Note: secret env was `user = postgres, pass = test`

## 2.08 project v1.2

[Source code](/Part2/Exercise2.08/)

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
Note: secret env was `user = postgres, pass = test`

For testing the containerization of the postgres database:
```console
$ docker build . -t sushashu/todo-db:2.08
$ docker run -d --name todo-db-container -e POSTGRES_PASSWORD=test -p 5432:5432 sushashu/todo-db:2.08
$ psql postgres://postgres:test@127.0.0.1:5432
```

## 2.09 project

[Source code](/Part2/Exercise2.09/)

- Same commands as in 2.08
- CronJob added

## 2.10 project v1.3

[Source code](/Part2/Exercise2.10/)

- Modification of [todo-backend index.js](/Part2/Exercise2.10/todo-backend/index.js) to log POST requests.
- Same commands as in 2.08
- Follow instructions in the [monitoring part](https://devopswithkubernetes.com/part-2/5-monitoring) of the course.

## Notes

- **kubectx** `sudo snap install kubectx --classic` to install kubectx in WSL
- **[Age](https://github.com/FiloSottile/age)** for file encryption
- **[SOPS](https://getsops.io/)** tool for managing secret
- **[HELM](https://helm.sh/)**: The package manager for Kubernetes 