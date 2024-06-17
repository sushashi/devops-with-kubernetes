# Part 2

## 2.01

[Source code](/Part2/Exercise2.01/)

Commands
```console
$ k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
$ docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube1
$ docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube2
$ kubectl apply -f manifests
```

Then visit 
- http://localhost:8081/pingpong to increase pong counter
- http://localhost:8081 to display timestamp hash and pong counter

Notes:
- I maintained a separate persistent volume for each application (logoutput write and read / pingpong counter).
- If we undeploy pingpong we receive `Ping / Pongs: undefined` on the second line.
- Redeploying again gives us the last pingpong count (persistent volume)