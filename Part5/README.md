# Part 5

## 5.01

[Source Code](/Part5/Exercise5.01/)

- Create k3d cluster:
    ```console
    $ k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
    ```

- Apply manifests
    ```console
    $ kubectl apply -f manifests/
    ```
    > Reapply if some ressource is not created because it depends on another one.

- Visit http://127.0.0.1:8081 check if [DummySite](/Part5/Exercise5.01/manifests/website_url.yaml) is deployed.

- Play around modifying and applying [DummySite](/Part5/Exercise5.01/manifests/website_url.yaml).
    > Note that the controller only fetches and serves newly applied DummySite.

## 5.02
[Modified manifest](/Part5/Exercise5.02/toinject.yaml) after running `$ kubectl get -n production deploy -o yaml`

- Create GKE cluster and deploy the project as described in [Exercise 4.08](/Part4/README.md#408)

- Install Linkerd by following the [getting started guide](https://linkerd.io/2.15/getting-started/)

- Deploy the Linkerd's dashboard:
    ```console
    $ linkerd viz install | kubectl apply -f -
    $ linkerd viz dashboard
    ```

    - If there is an error (can also be checked by running `linkerd check`):
        Add the IP of argo-rollouts svc with:
            
             `$ kubectl edit configmap linkerd-config -n linkerd`
             
        followed by `/8` or any other subnet mask (No clue what? it just worked with 8. Editing in [VIM](https://stackoverflow.com/questions/11828270/how-do-i-exit-vim))

- Add Linkerd to the deployment:
    ```console
    $ kubectl get -n production deploy -o yaml\
    | linkerd inject - \
    | kubectl apply -f -
    ```
    > Note that only `todo-broadcaster` is a *Deployment*, `project` and `todos-backend` are *Rollout*.

- Check the Linkerd dashboard (only `todo-broadcaster`)

## 5.03

- Create k3d cluster:
    ```console
    $ k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
    ```
- Install Linkerd by following the [getting started guide](https://linkerd.io/2.15/getting-started/)

- Install Linkerd viz:
    ```console
    $ linkerd viz install | kubectl apply -f -
    $ linkerd viz dashboard
    ```
- Follow the demo instruction for [Flagger](https://linkerd.io/2.15/tasks/flagger/#flagger)

- Start the rollout:
    ```console
    $ kubectl -n test set image deployment/podinfo \
      podinfod=quay.io/stefanprodan/podinfo:1.7.1
    ```

- To watch the rollout:
    ```console
    $ kubectl -n test get ev --watch
    ```

- Logs of the rollout
    ```console
    $ kubectl -n test get ev --watch
        Warning: short name "ev" could also match lower priority resource events.events.k8s.io
        LAST SEEN   TYPE      REASON                  OBJECT                                  MESSAGE
        6m38s       Normal    ScalingReplicaSet       deployment/load                         Scaled up replica set load-856b85d48d to 1
        6m38s       Normal    ScalingReplicaSet       deployment/frontend                     Scaled up replica set frontend-f6f5549f8 to 1
        6m38s       Normal    Injected                deployment/load                         Linkerd sidecar proxy injected
        6m38s       Normal    Injected                deployment/frontend                     Linkerd sidecar proxy injected
        6m38s       Normal    SuccessfulCreate        replicaset/load-856b85d48d              Created pod: load-856b85d48d-n86xz
        6m37s       Normal    Scheduled               pod/load-856b85d48d-n86xz               Successfully assigned test/load-856b85d48d-n86xz to k3d-k3s-default-agent-1
        6m38s       Normal    SuccessfulCreate        replicaset/frontend-f6f5549f8           Created pod: frontend-f6f5549f8-hgmmb
        6m37s       Normal    Scheduled               pod/frontend-f6f5549f8-hgmmb            Successfully assigned test/frontend-f6f5549f8-hgmmb to k3d-k3s-default-agent-1
        6m38s       Normal    ScalingReplicaSet       deployment/podinfo                      Scaled up replica set podinfo-5f6cfbbbc8 to 1
        6m38s       Normal    Injected                deployment/podinfo                      Linkerd sidecar proxy injected
        6m38s       Normal    SuccessfulCreate        replicaset/podinfo-5f6cfbbbc8           Created pod: podinfo-5f6cfbbbc8-7pw7r
        6m37s       Normal    Scheduled               pod/podinfo-5f6cfbbbc8-7pw7r            Successfully assigned test/podinfo-5f6cfbbbc8-7pw7r to k3d-k3s-default-server-0
        6m38s       Normal    Pulled                  pod/load-856b85d48d-n86xz               Container image "cr.l5d.io/linkerd/proxy-init:v2.4.1" already present on machine
        6m38s       Normal    Pulled                  pod/frontend-f6f5549f8-hgmmb            Container image "cr.l5d.io/linkerd/proxy-init:v2.4.1" already present on machine
        6m38s       Normal    Created                 pod/load-856b85d48d-n86xz               Created container linkerd-init
        6m38s       Normal    Created                 pod/frontend-f6f5549f8-hgmmb            Created container linkerd-init
        6m38s       Normal    Pulled                  pod/podinfo-5f6cfbbbc8-7pw7r            Container image "cr.l5d.io/linkerd/proxy-init:v2.4.1" already present on machine
        6m38s       Normal    Created                 pod/podinfo-5f6cfbbbc8-7pw7r            Created container linkerd-init
        6m38s       Normal    Started                 pod/load-856b85d48d-n86xz               Started container linkerd-init
        6m38s       Normal    Started                 pod/frontend-f6f5549f8-hgmmb            Started container linkerd-init
        6m38s       Normal    Started                 pod/podinfo-5f6cfbbbc8-7pw7r            Started container linkerd-init
        6m37s       Normal    Pulled                  pod/podinfo-5f6cfbbbc8-7pw7r            Container image "cr.l5d.io/linkerd/proxy:edge-24.7.3" already present on machine
        6m37s       Normal    Created                 pod/podinfo-5f6cfbbbc8-7pw7r            Created container linkerd-proxy
        6m37s       Normal    Started                 pod/podinfo-5f6cfbbbc8-7pw7r            Started container linkerd-proxy
        6m37s       Normal    IssuedLeafCertificate   serviceaccount/default                  issued certificate for default.test.serviceaccount.identity.linkerd.cluster.local until 2024-07-26 07:26:51 +0000 UTC: ee7f70a8bc315d72ee6423f1ec6bfc2c10ae4eb719b5761d2c5f7267fdbf3f86
        6m37s       Normal    Pulled                  pod/podinfo-5f6cfbbbc8-7pw7r            Container image "quay.io/stefanprodan/podinfo:1.7.0" already present on machine
        6m37s       Normal    Created                 pod/podinfo-5f6cfbbbc8-7pw7r            Created container podinfod
        6m37s       Normal    Started                 pod/podinfo-5f6cfbbbc8-7pw7r            Started container podinfod
        6m37s       Normal    Pulled                  pod/frontend-f6f5549f8-hgmmb            Container image "cr.l5d.io/linkerd/proxy:edge-24.7.3" already present on machine
        6m37s       Normal    Pulled                  pod/load-856b85d48d-n86xz               Container image "cr.l5d.io/linkerd/proxy:edge-24.7.3" already present on machine
        6m37s       Normal    Created                 pod/load-856b85d48d-n86xz               Created container linkerd-proxy
        6m37s       Normal    Created                 pod/frontend-f6f5549f8-hgmmb            Created container linkerd-proxy
        6m37s       Normal    Started                 pod/frontend-f6f5549f8-hgmmb            Started container linkerd-proxy
        6m37s       Normal    Started                 pod/load-856b85d48d-n86xz               Started container linkerd-proxy
        6m37s       Normal    IssuedLeafCertificate   serviceaccount/default                  issued certificate for default.test.serviceaccount.identity.linkerd.cluster.local until 2024-07-26 07:26:51 +0000 UTC: de3a107eb8ce27e1a5f2cec7d059ec1fa818e8807bd6b90d57112e935b4540d5
        6m37s       Normal    IssuedLeafCertificate   serviceaccount/default                  issued certificate for default.test.serviceaccount.identity.linkerd.cluster.local until 2024-07-26 07:26:51 +0000 UTC: 9a60e127c99b597d875bff3b004a65c6be4023114d4bef4bb610fa6675ab73b0
        6m37s       Normal    Pulling                 pod/load-856b85d48d-n86xz               Pulling image "buoyantio/slow_cooker:1.2.0"
        6m37s       Normal    Pulling                 pod/frontend-f6f5549f8-hgmmb            Pulling image "nginx:alpine"
        6m33s       Normal    Pulled                  pod/load-856b85d48d-n86xz               Successfully pulled image "buoyantio/slow_cooker:1.2.0" in 3.343s (3.343s including waiting)    
        6m33s       Normal    Created                 pod/load-856b85d48d-n86xz               Created container slow-cooker
        6m33s       Normal    Started                 pod/load-856b85d48d-n86xz               Started container slow-cooker
        6m31s       Normal    Pulled                  pod/frontend-f6f5549f8-hgmmb            Successfully pulled image "nginx:alpine" in 5.51s (5.51s including waiting)
        6m31s       Normal    Created                 pod/frontend-f6f5549f8-hgmmb            Created container nginx
        6m31s       Normal    Started                 pod/frontend-f6f5549f8-hgmmb            Started container nginx
        3m7s        Warning   Synced                  canary/podinfo                          podinfo-primary.test not ready: waiting for rollout to finish: observed deployment generation less than desired generation
        3m7s        Normal    ScalingReplicaSet       deployment/podinfo-primary              Scaled up replica set podinfo-primary-677d946d47 to 1
        3m7s        Normal    Injected                deployment/podinfo-primary              Linkerd sidecar proxy injected
        3m7s        Normal    SuccessfulCreate        replicaset/podinfo-primary-677d946d47   Created pod: podinfo-primary-677d946d47-2wqb8
        3m7s        Normal    Scheduled               pod/podinfo-primary-677d946d47-2wqb8    Successfully assigned test/podinfo-primary-677d946d47-2wqb8 to k3d-k3s-default-agent-0
        3m7s        Normal    Pulled                  pod/podinfo-primary-677d946d47-2wqb8    Container image "cr.l5d.io/linkerd/proxy-init:v2.4.1" already present on machine
        3m7s        Normal    Created                 pod/podinfo-primary-677d946d47-2wqb8    Created container linkerd-init
        3m7s        Normal    Started                 pod/podinfo-primary-677d946d47-2wqb8    Started container linkerd-init
        3m6s        Normal    Pulled                  pod/podinfo-primary-677d946d47-2wqb8    Container image "cr.l5d.io/linkerd/proxy:edge-24.7.3" already present on machine
        3m6s        Normal    Created                 pod/podinfo-primary-677d946d47-2wqb8    Created container linkerd-proxy
        3m6s        Normal    Started                 pod/podinfo-primary-677d946d47-2wqb8    Started container linkerd-proxy
        3m6s        Normal    IssuedLeafCertificate   serviceaccount/default                  issued certificate for default.test.serviceaccount.identity.linkerd.cluster.local until 2024-07-26 07:30:22 +0000 UTC: 98125a6ed17f9a557b0b113890405d0ba575fa1fa4a8c78af9cb92a067b59b3e
        3m6s        Normal    Pulling                 pod/podinfo-primary-677d946d47-2wqb8    Pulling image "quay.io/stefanprodan/podinfo:1.7.0"
        3m2s        Normal    Pulled                  pod/podinfo-primary-677d946d47-2wqb8    Successfully pulled image "quay.io/stefanprodan/podinfo:1.7.0" in 4.05s (4.05s including waiting)
        3m2s        Normal    Created                 pod/podinfo-primary-677d946d47-2wqb8    Created container podinfod
        3m2s        Normal    Started                 pod/podinfo-primary-677d946d47-2wqb8    Started container podinfod
        2m57s       Normal    ScalingReplicaSet       deployment/podinfo                      Scaled down replica set podinfo-5f6cfbbbc8 to 0 from 1
        2m57s       Normal    SuccessfulDelete        replicaset/podinfo-5f6cfbbbc8           Deleted pod: podinfo-5f6cfbbbc8-7pw7r
        2m57s       Normal    Killing                 pod/podinfo-5f6cfbbbc8-7pw7r            Stopping container linkerd-proxy
        2m57s       Normal    Killing                 pod/podinfo-5f6cfbbbc8-7pw7r            Stopping container podinfod
        2m57s       Warning   Synced                  canary/podinfo                          HTTPRoute .test update error: resource name may not be empty while reconciling
        2m47s       Normal    Synced                  canary/podinfo                          all the metrics providers are available!
        2m47s       Normal    Synced                  canary/podinfo                          Initialization done! podinfo.test
        0s          Normal    Synced                  canary/podinfo                          New revision detected! Scaling up podinfo.test
        0s          Normal    ScalingReplicaSet       deployment/podinfo                      Scaled up replica set podinfo-d9d886567 to 1 from 0
        0s          Normal    Injected                deployment/podinfo                      Linkerd sidecar proxy injected
        0s          Normal    SuccessfulCreate        replicaset/podinfo-d9d886567            Created pod: podinfo-d9d886567-7wtlg
        0s          Normal    Scheduled               pod/podinfo-d9d886567-7wtlg             Successfully assigned test/podinfo-d9d886567-7wtlg to k3d-k3s-default-server-0
        0s          Normal    Pulled                  pod/podinfo-d9d886567-7wtlg             Container image "cr.l5d.io/linkerd/proxy-init:v2.4.1" already present on machine
        0s          Normal    Created                 pod/podinfo-d9d886567-7wtlg             Created container linkerd-init
        0s          Normal    Started                 pod/podinfo-d9d886567-7wtlg             Started container linkerd-init
        0s          Normal    Pulled                  pod/podinfo-d9d886567-7wtlg             Container image "cr.l5d.io/linkerd/proxy:edge-24.7.3" already present on machine
        0s          Normal    Created                 pod/podinfo-d9d886567-7wtlg             Created container linkerd-proxy
        0s          Normal    Started                 pod/podinfo-d9d886567-7wtlg             Started container linkerd-proxy
        0s          Normal    IssuedLeafCertificate   serviceaccount/default                  issued certificate for default.test.serviceaccount.identity.linkerd.cluster.local until 2024-07-26 07:35:22 +0000 UTC: 103ba21a24ab0789e1be6b98cbd71d8b17df44ecdbc1548f74e1b061d50a3fd8
        0s          Normal    Pulling                 pod/podinfo-d9d886567-7wtlg             Pulling image "quay.io/stefanprodan/podinfo:1.7.1"
        0s          Normal    Pulled                  pod/podinfo-d9d886567-7wtlg             Successfully pulled image "quay.io/stefanprodan/podinfo:1.7.1" in 3.77s (3.77s including waiting)
        0s          Normal    Created                 pod/podinfo-d9d886567-7wtlg             Created container podinfod
        0s          Normal    Started                 pod/podinfo-d9d886567-7wtlg             Started container podinfod
        0s          Normal    Synced                  canary/podinfo                          Starting canary analysis for podinfo.test
        0s          Normal    Synced                  canary/podinfo                          Advance podinfo.test canary weight 10
        0s          Normal    Synced                  canary/podinfo                          Advance podinfo.test canary weight 20
        0s          Normal    Synced                  canary/podinfo                          Advance podinfo.test canary weight 30
        0s          Normal    Synced                  canary/podinfo                          Advance podinfo.test canary weight 40
        0s          Normal    Synced                  canary/podinfo                          Advance podinfo.test canary weight 50
        0s          Normal    Synced                  canary/podinfo                          (combined from similar events): Advance podinfo.test canary weight 60
        0s          Normal    Synced                  canary/podinfo                          (combined from similar events): Advance podinfo.test canary weight 70
        0s          Normal    Synced                  canary/podinfo                          (combined from similar events): Advance podinfo.test canary weight 80
        0s          Normal    Synced                  canary/podinfo                          (combined from similar events): Advance podinfo.test canary weight 90
        0s          Normal    Synced                  canary/podinfo                          (combined from similar events): Advance podinfo.test canary weight 100
        0s          Normal    Synced                  canary/podinfo                          (combined from similar events): Copying podinfo.test template spec to podinfo-primary.test
        0s          Normal    ScalingReplicaSet       deployment/podinfo-primary              Scaled up replica set podinfo-primary-54888b44c6 to 1
        0s          Normal    Injected                deployment/podinfo-primary              Linkerd sidecar proxy injected
        0s          Normal    SuccessfulCreate        replicaset/podinfo-primary-54888b44c6   Created pod: podinfo-primary-54888b44c6-5svbk
        0s          Normal    Scheduled               pod/podinfo-primary-54888b44c6-5svbk    Successfully assigned test/podinfo-primary-54888b44c6-5svbk to k3d-k3s-default-agent-1
        0s          Normal    Pulled                  pod/podinfo-primary-54888b44c6-5svbk    Container image "cr.l5d.io/linkerd/proxy-init:v2.4.1" already present on machine
        0s          Normal    Created                 pod/podinfo-primary-54888b44c6-5svbk    Created container linkerd-init
        0s          Normal    Started                 pod/podinfo-primary-54888b44c6-5svbk    Started container linkerd-init
        0s          Normal    Pulled                  pod/podinfo-primary-54888b44c6-5svbk    Container image "cr.l5d.io/linkerd/proxy:edge-24.7.3" already present on machine
        0s          Normal    Created                 pod/podinfo-primary-54888b44c6-5svbk    Created container linkerd-proxy
        0s          Normal    Started                 pod/podinfo-primary-54888b44c6-5svbk    Started container linkerd-proxy
        0s          Normal    IssuedLeafCertificate   serviceaccount/default                  issued certificate for default.test.serviceaccount.identity.linkerd.cluster.local until 2024-07-26 07:37:11 +0000 UTC: c1f162d1e8725fb2b25b9e1f435adc672d2b1354cd12915b1d6e7dd7287cbf39
        0s          Normal    Pulling                 pod/podinfo-primary-54888b44c6-5svbk    Pulling image "quay.io/stefanprodan/podinfo:1.7.1"
        0s          Normal    Pulled                  pod/podinfo-primary-54888b44c6-5svbk    Successfully pulled image "quay.io/stefanprodan/podinfo:1.7.1" in 3.58s (3.58s including waiting)
        0s          Normal    Created                 pod/podinfo-primary-54888b44c6-5svbk    Created container podinfod
        0s          Normal    Started                 pod/podinfo-primary-54888b44c6-5svbk    Started container podinfod
        0s          Normal    ScalingReplicaSet       deployment/podinfo-primary              Scaled down replica set podinfo-primary-677d946d47 to 0 from 1
        0s          Normal    SuccessfulDelete        replicaset/podinfo-primary-677d946d47   Deleted pod: podinfo-primary-677d946d47-2wqb8
        0s          Normal    Killing                 pod/podinfo-primary-677d946d47-2wqb8    Stopping container linkerd-proxy
        0s          Normal    Killing                 pod/podinfo-primary-677d946d47-2wqb8    Stopping container podinfod
        0s          Normal    Synced                  canary/podinfo                          (combined from similar events): Routing all traffic to primary
        0s          Normal    ScalingReplicaSet       deployment/podinfo                      Scaled down replica set podinfo-d9d886567 to 0 from 1
        0s          Normal    Synced                  canary/podinfo                          (combined from similar events): Promotion completed! Scaling down podinfo.test
        0s          Normal    SuccessfulDelete        replicaset/podinfo-d9d886567            Deleted pod: podinfo-d9d886567-7wtlg
        0s          Normal    Killing                 pod/podinfo-d9d886567-7wtlg             Stopping container linkerd-proxy
        0s          Normal    Killing                 pod/podinfo-d9d886567-7wtlg             Stopping container podinfod
        0s          Warning   Unhealthy               pod/podinfo-d9d886567-7wtlg             Readiness probe failed: Get "http://10.42.2.12:4191/ready": dial tcp 10.42.2.12:4191: connect: connection refused
    ```

## 5.04
[Manifests](/Part5/Exercise5.04/manifests/)

- Create k3d cluster:
    ```console
    $ k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
    $ docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube
    ```
- Create namespace *wikipedia*:
    ```console
    $ kubectl create namespace wikipedia
    ```
- Deploy:
    ```console
    $ kubectl apply -f manifests/
    ```
    > Note that init and sidecar container use a simple [alpine image with curl installed](/Part5/Exercise5.04/alpinecurl/).

- Visit http://127.0.0.1:8081

## 5.05

#### Rancher is better than OpenShift because:
- It can manage multiple clusters
- It can import existing clusters
- It can manage different kubernetes distributions
- It is generally more flexible
- It is easier to install
- It is open-source and free

## 5.06

- Create k3d cluster without Traefik:
    ```console
    $ k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2 --k3s-arg "--disable=traefik@server:0"
    ```

- Install Knative: [Knative Installation Guide](https://knative.dev/docs/install/yaml-install/serving/install-serving-with-yaml/#verifying-image-signatures)

- Testing:
    - [Deploying a Knative Service](https://knative.dev/docs/getting-started/first-service/#__tabbed_1_2)
    - [Autoscaling](https://knative.dev/docs/getting-started/first-autoscale/)
    - [Traffic splitting (Revision)](https://knative.dev/docs/getting-started/first-traffic-split/)
    - To access service:
        ```console
        $ curl -H "Host: hello.knative-serving.172.18.0.3.sslip.io" http://localhost:8081
        ```
        > Where *Host* URL comes from the command `kubectl get ksvc` 
    - To observe autoscaling:
        ```console
        $ kubectl get pod -l serving.knative.dev/service=hello -w
        ```
    - To list revision:
        ```console
        $ kubectl get revisions
        ```

## 5.07

[Source code](/Part5/Exercise5.07/)

[Manifests](/Part5/Exercise5.07/knative-manifests/)

- Create k3d cluster without Treaefik:
    ```console
    $ k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2 --k3s-arg "--disable=traefik@server:0"
    $ docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube
    ```

- Install Knative: [Knative Installation Guide](https://knative.dev/docs/install/yaml-install/serving/install-serving-with-yaml/#verifying-image-signatures)

- Patch Knative to use Persistent Volumes: [Volume Support for Knative services](https://knative.dev/docs/serving/services/storage/)
    - In order to use persistent volume for splitted write/read logoutput text file.

- Deploy the PingPong application serverless.
    ```console
    $ kubectl apply -f knative-manifests
    ```
- Observe autoscaling of *deployment-pingpong* with:
    ```console
    $ kubectl get pod -l serving.knative.dev/service=pingpong -w
    ```
- Observe autoscaling of *deployment-logoutput* with:
    ```console
    $ kubectl get pod -l serving.knative.dev/service=splitted-logoutput -w
    ```
- Access the Pingpong service to increase the count:
    ```console
    $ curl --verbose -H "Host: pingpong.knative-serving.172.18.0.3.sslip.io" http://localhost:8081/pingpong
    ```
    > Only autoscaling activities on *deployment-pingpong* is observable.

    - Note that we can also get the *count of pingpong* with:
        ```console
        $ curl -H "Host: pingpong.knative-serving.172.18.0.3.sslip.io" http://localhost:8081/count
        ```
- Access the application to view logoutput and pingpong count with:
    ```console
    $ curl --verbose -H "Host: splitted-logoutput.knative-serving.172.18.0.3.sslip.io" http://localhost:8081
    ```
    > Autoscaling activities on *deployment-logoutput* and *deployment-pingpong* are observable since logoutput calls pingpong/count

### Note to self:
- To get the *Host* address:
    ```console
    $ kubectl get ksvc
    ```
- `FETCH_URL` variable in [deployment-logoutput](/Part5/Exercise5.07/knative-manifests/deployment-logoutput.yaml):
    - Host address of pingpong service is used to fetch from `/pingpong/count`:

        ```console
        http://pingpong.knative-serving.172.18.0.3.sslip.io/count
        ```
    > ~ Knative version of `http://pingpong-svc:1234/count`


- Mounting large volumes may add considerable overhead to the application's start up time. [Persistent Volume Warning](https://knative.dev/docs/serving/services/storage/#volume-support-for-knative-services)

## 5.08

![Image](/Part5/Exercise5.08/landscape_marked.png)

- **Redis** - used in Part 2 StatefulSets of the course
- **mondoDB** - used outside of the course
- **MySQL** - used outside of the course
- **PostgreDB** - used in the whole course to store todos and pingpong count
- **Spark** - used outside of the course
- **NATS** - used in Part 4 exercise 4.06 to broadcast todos notification messages
- **HELM** - used in Part 2 to install Prometheus
- **ArgoCD** - used in Part 4 GitOps exercises 4.07 and 4.08
- **GitHub Actions** - used in Part 3 Deployment Pipeline and Part 4 GitOps
- **GitLab** - used outside of the course
- **Kubernetes** - used in the whole course
- **etcd** - indirectly used in the whole course, there is some link with kubernetes
- **NGINX** - used in Part 4 in as ingress-nginx for GKE ingress and pod readiness
- **traefik proxy** - indirectly used in the whole course, k3s uses it as an ingress controller as I understand
- **LINKERD** - used in Part 5 service mesh
- **Google Persistent Disk** - used in Part 3 and 4 in GKE for persistent disks
- **Google Container Registry** - used in Part 3 deployment pipeline
- **Google Kubernetes Engine** - used in Part 3 and 4
- **K3S** - used in the whole course
- **Prometheus** - used in Part 2 monitoring
- **Grafana** - used in Part 2 monitoring to view the data
- **Grafana Loki** - used in Part 2 monitoring to see logs