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