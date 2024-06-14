# Part 1

## 1.01 logoutput
[Source code](Exercise1.01/)

Commands
```console
$ docker build . -t logoutput
$ docker tag logoutput sushashu/logoutput:1.01
$ docker push sushashu/logoutput:1.01
$ k3d cluster create -a 2
$ kubectl create deployment logoutput --image=sushashu/logoutput:1.01
$ kubectl get pods
$ kubectl logs logoutput-75684dbfdf-x45lh
```

Output
```console
$ kubectl logs logoutput-75684dbfdf-x45lh

    > logoutput@1.0.0 start
    > node index.js

    2024-06-12T11:50:12.647Z: slh5mhm2-1aue-vcoi-dd9k-yfow-moox6v0kah
    2024-06-12T11:50:17.657Z: slh5mhm2-1aue-vcoi-dd9k-yfow-moox6v0kah
    2024-06-12T11:50:22.659Z: slh5mhm2-1aue-vcoi-dd9k-yfow-moox6v0kah
    2024-06-12T11:50:27.660Z: slh5mhm2-1aue-vcoi-dd9k-yfow-moox6v0kah
    2024-06-12T11:50:32.666Z: slh5mhm2-1aue-vcoi-dd9k-yfow-moox6v0kah
    2024-06-12T11:50:37.669Z: slh5mhm2-1aue-vcoi-dd9k-yfow-moox6v0kah
```

## 1.02 project v0.1
[Source code](/Part1/Exercise1.02/)

Commands
```console
$ docker build . -t project
$ docker tag project sushashu/project:v0.1
$ docker push sushashu/project:v0.1
$ k3d cluster create -a 2
$ kubectl create deployment project --image=sushashu/project:v0.1
$ kubectl get pods
$ kubectl logs project-5c76c9c86-vhbzf
```

Output
```console
$ kubectl logs project-5c76c9c86-vhbzf
    > project@1.0.0 start
    > node index.js

    Server started on port undefined
```

## 1.03 logoutput

[Source code](/Part1/Exercise1.03/)

Commands
```console
$ k3d cluster create -a 2
$ kubectl apply -f manifests
$ kubectl get pods
$ kubectl logs logoutput-75684dbfdf-mpzlj
```

Output
```console
$ kubectl logs logoutput-75684dbfdf-mpzlj

    > logoutput@1.0.0 start
    > node index.js

    2024-06-12T12:54:00.465Z: 0094gwz1-bvuf-nm8k-u2dz-839p-hv263eg2ldk
    2024-06-12T12:54:05.472Z: 0094gwz1-bvuf-nm8k-u2dz-839p-hv263eg2ldk
    2024-06-12T12:54:10.476Z: 0094gwz1-bvuf-nm8k-u2dz-839p-hv263eg2ldk
```

## 1.04 project v0.2

[Source code](/Part1/Exercise1.04/)

Commands
```console
$ k3d cluster create -a 2
$ kubectl apply -f manifests
$ kubectl get pods
$ kubectl logs project-5c76c9c86-9l5dt
```

Output
```console
$ kubectl logs project-5c76c9c86-9l5dt

    > project@1.0.0 start
    > node index.js

    Server started on port undefined
```

## 1.05 project v0.3

[Source code](/Part1/Exercise1.05/)

Commands
```console
$ docker build . -t project:v0.3
$ docker tag project:v0.3 sushashu/project:v0.3
$ docker push sushashu/project:v0.3
$ k3d cluster create -a 2
$ kubectl apply -f manifests
$ kubectl get pods
$ kubectl logs project-5d76f54684-ksk8s
$ kubectl port-forward project-5d76f54684-ksk8s 3003:3000
```
Then visit http://localhost:3003/

Output
```console
$ kubectl logs project-5d76f54684-ksk8s

    > project@1.0.0 start
    > node index.js

    Server started on port 3000

$ kubectl port-forward project-5d76f54684-ksk8s 3003:3000
    Forwarding from 127.0.0.1:3003 -> 3000
    Forwarding from [::1]:3003 -> 3000
    Handling connection for 3003
    Handling connection for 3003
```

## 1.06 project v0.4

[Source code](/Part1/Exercise1.06/)

Commands
```console
$ k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
$ kubectl apply -f manifests
```

Then visit http://localhost:8082/

## 1.07 logoutput

[Source code](/Part1/Exercise1.07/)

Commands
```console
$ k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
$ kubectl apply -f manifests
```

Then visit http://localhost:8081/

## 1.08 project v0.5

[Source code](/Part1/Exercise1.08/)

Commands
```console
$ k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
$ kubectl apply -f manifests
```
Then visit http://localhost:8081/

## 1.09 pingpong

[Source code](/Part1/Exercise1.09/)

Deploy `project v0.5` as in exercise 1.08

Then deploy `pingpong` with command
```console
$ kubectl apply -f manifests`
```

Then visit:
- http://localhost:8081/ and 
- http://localhost:8081/pingpong

Note to self: path in `index.js` and `ingress.yaml` has to match

## 1.10 logoutput
[Source code](/Part1/Exercise1.10/)

First build and push images on Docker Hub

Commands
```console
$ kubectl apply -f manifests
$ kubectl get pods
$ kubectl logs splitted-logoutput-5c64b4b58-nndds --all-containers=true
```
Output
```console
$ kubectl logs splitted-logoutput-5c64b4b58-nndds --all-containers=true

    > logoutput-writer@1.0.0 start
    > node index.js

    Successfully written
    Successfully written
    Successfully written
    Successfully written
    Successfully written
    Successfully written

    > logoutput-reader@1.0.0 start
    > node index.js

    Reader Server started on port 3000
    mcmnq5 - 2024-06-13T11:57:05.115Z: lqh8x28z-c62a-xnej-d600-kljp-z6odzaryijh
    6y34zh - 2024-06-13T11:57:10.120Z: lqh8x28z-c62a-xnej-d600-kljp-z6odzaryijh
    kvk7mi - 2024-06-13T11:57:15.125Z: lqh8x28z-c62a-xnej-d600-kljp-z6odzaryijh
    kruisj - 2024-06-13T11:57:20.129Z: lqh8x28z-c62a-xnej-d600-kljp-z6odzaryijh
    4fj30b - 2024-06-13T11:57:25.135Z: lqh8x28z-c62a-xnej-d600-kljp-z6odzaryijh
    dzbjpd - 2024-06-13T11:57:30.141Z: lqh8x28z-c62a-xnej-d600-kljp-z6odzaryijh
```

Then visit http://localhost:8081/

## 1.11 pingpong & logoutput

[Source code](/Part1/Exercise1.11/)

Commands
```console
$ k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
$ docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube
$ kubectl apply -f manifests
```

Then visit 
- http://localhost:8081/pingpong to increase pong counter
- http://localhost:8081 to display timestamp hash and pong counter

## Notes
LENS in Windows and k3d in WSL, *kubeconfig* issue :
 - If k3d is in WSL and you want to run Lens in Windows, create a symlink from WSL to Windows with (Powershell as admin):

     `New-Item -ItemType SymbolicLink -Path "C:\Users\USERNAME\.kube" -Target "\\wsl$\Ubuntu\home\USERNAME\.kube"`