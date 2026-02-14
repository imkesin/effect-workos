import * as GCP from "@pulumi/gcp"
import * as Pulumi from "@pulumi/pulumi"

export function createGithubActionsResources(options: {
  readonly repository: GCP.artifactregistry.Repository
  readonly githubRepository: string
}) {
  const serviceAccount = new GCP.serviceaccount.Account(
    "github-actions",
    {
      accountId: "github-actions",
      displayName: "GitHub Actions"
    }
  )

  const _repositoryIamMember = new GCP.artifactregistry.RepositoryIamMember(
    "github-actions-registry-writer",
    {
      repository: options.repository.name,
      location: options.repository.location,
      role: "roles/artifactregistry.writer",
      member: Pulumi.interpolate`serviceAccount:${serviceAccount.email}`
    }
  )

  const workloadIdentityPool = new GCP.iam.WorkloadIdentityPool(
    "github-actions-pool",
    {
      workloadIdentityPoolId: "github-actions",
      displayName: "GitHub Actions"
    }
  )

  const workloadIdentityPoolProvider = new GCP.iam.WorkloadIdentityPoolProvider(
    "github-actions-provider",
    {
      workloadIdentityPoolId: workloadIdentityPool.workloadIdentityPoolId,
      workloadIdentityPoolProviderId: "github-oidc",
      displayName: "GitHub OIDC",
      attributeMapping: {
        "google.subject": "assertion.sub",
        "attribute.repository": "assertion.repository"
      },
      attributeCondition: `assertion.repository == "${options.githubRepository}"`,
      oidc: {
        issuerUri: "https://token.actions.githubusercontent.com"
      }
    }
  )

  const _workloadIdentityBinding = new GCP.serviceaccount.IAMMember(
    "github-actions-workload-identity-binding",
    {
      serviceAccountId: serviceAccount.name,
      role: "roles/iam.workloadIdentityUser",
      member: Pulumi
        .interpolate`principalSet://iam.googleapis.com/${workloadIdentityPool.name}/attribute.repository/${options.githubRepository}`
    }
  )

  return {
    serviceAccount,
    workloadIdentityPool,
    workloadIdentityPoolProvider
  }
}
