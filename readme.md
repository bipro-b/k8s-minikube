# Minikube Installation Guide for Ubuntu

This guide provides step-by-step instructions for installing Minikube on Ubuntu. You can run a single-node Kubernetes cluster locally or in AWS for development and testing purposes.

## Pre-requisites

* Ubuntu OS
* sudo privileges
* Virtualization support enabled (Check with `egrep -c '(vmx|svm)' /proc/cpuinfo`, 0=disabled 1=enabled) 

---

## Step 1: Update System Packages

Update your UBUNTU package lists to make sure you are getting the latest version and dependencies.

```bash
sudo apt update
```


## Step 2: Install Required Packages

Install some basic required packages.

```bash
sudo apt install -y curl wget apt-transport-https
```

---

## Step 3: Install Docker

Minikube can run a Kubernetes cluster either in a VM or locally via Docker. This guide demonstrates the Docker method.

```bash
sudo apt install -y docker.io
```


Start and enable Docker.

```bash
sudo systemctl enable --now docker
```

Add current user to docker group (To use docker without root)

```bash
sudo usermod -aG docker $USER
```
Now, logout from the machine and connect again.

Alternatively (without sudo reboot):
```bash
sudo chown $USER /var/run/docker.sock
```

---

## Step 4: Install Minikube

First, download the Minikube binary using `curl`:

```bash
curl -LO https://github.com/kubernetes/minikube/releases/latest/download/minikube-linux-amd64  #download
sudo install minikube-linux-amd64 /usr/local/bin/minikube && rm minikube-linux-amd64 #install Minikube
```

Make it executable and move it into your path:

```bash
chmod +x minikube
sudo mv minikube /usr/local/bin/
```

Check minikube version
```bash
minikube version
```

---

## Step 5: Install kubectl

Download kubectl, which is a Kubernetes command-line tool.

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
```
Make it executable and move it into your path:

```bash
chmod +x kubectl
sudo mv kubectl /usr/local/bin/
```

---

## Step 6: Start Minikube

Now, start Minikube with the following command:

```bash
minikube start --driver=docker --vm=true 
```

If you already have Docker installed, start Minikube with the following command:

```bash
minikube start 
```

This will start a single-node Kubernetes cluster inside a Docker container and your Kubernetes cluster should be ready.

---

## Step 7: Check Cluster Status

Check the cluster status with:

```bash
minikube status
```



You can also use `kubectl` to interact with your cluster:

```bash
kubectl get nodes
```

---

## Step 8: Stop Minikube

When you are done, you can stop the Minikube cluster with:

```bash
minikube stop
```

---

## Optional: Delete Minikube Cluster

If you wish to delete the Minikube cluster entirely, you can do so with:

```bash
minikube delete
```

---

Cheers!

# deploy-sample-application

Follow the instructions after the Minikube cluster configurations are completed. We will deploy and make rolling update (i.e. app version).

## Create a Namespace

In Kubernetes namespaces provide a mechanism for isolating groups of resources within a single cluster. Names of resources need to be unique within a namespace. Run the below command

    kubectl create namespace sample-app

## Create a Kubernetes deployment

A Kubernetes Deployment tells Kubernetes how to create or modify instances of the pods that hold a containerized (docker our case) application. Deployments can help to efficiently scale the number of replica pods, enable the rollout of updated code in a controlled manner, or roll back to an earlier deployment version if necessary.

Apply the deployment manifest to your cluster.

    kubectl apply -f 01-create-deployment.yaml

Review the deployment configurations.

    kubectl describe deployments.apps --namespace sample-app sample-deployment


## Create a service

A service allows you to access all replicas through a single IP address or name.

There are different types of Service objects, and the one we want to use for testing is called ClusterIP or LoadBalancer, which means an external load balancer for Minikube.

Apply the service manifest to your cluster.

	kubectl apply -f 02-service-to-expose-deployment.yaml

View all resources that exist in the sample-app namespace.

	kubectl get all --namespace sample-app


## Deploy a new application version (rolling out)

In kubernetes you can easily deploy a new version of an existing deployment by updating the image details.

Apply `03-update-or-rollout-deployment.yaml` deployment manifest to your cluster.

    kubectl apply -f 03-update-or-rollout-deployment.yaml

Kubernetes performs a rolling update by default to minimize the downtime during upgrades and create a replica set and pods.
Review the deployment configurations and verify the image details

    kubectl describe deployments.apps --namespace sample-app   sample-deployment

## Check if nginx is working from terminal (not on the browser):
	minikube ip #it will return the minikube IP

	curl http://<ip got from minikube ip command>:30080  # i.e. http://192.168.49.5:30080

	You should see html content
## Once you're finished with the sample application, you can remove the sample namespace, service, and deployment with the following command.

    kubectl delete namespace sample-app
