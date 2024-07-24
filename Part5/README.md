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