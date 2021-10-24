using Amazon.Extensions.NETCore.Setup;
using Amazon.Runtime;
using Amazon.Runtime.CredentialManagement;
using Amazon.SimpleSystemsManagement;
using Amazon.SimpleSystemsManagement.Model;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace MapCore.Admin.Models
{
    class ConnectionStringProvider
    {
        private readonly AWSOptions _awsOptions;
        public ConnectionStringProvider(AWSOptions awsOptions)
        {
            _awsOptions = awsOptions;
        }

        /// <summary>
        /// Fetches the connection string from AWS SSM parameter store
        /// </summary>
        /// <param name="paramName">The param name excluding the dev/prod prefix e.g. "/app/EmailAutomation/EmailAutomationConnectionString"</param>
        /// <returns></returns>
        public async Task<string> GetConnectionString(string paramNameBase, bool? devModeOverride = true)
        {
            string runtimeEnvironment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            bool devMode = devModeOverride.HasValue ? devModeOverride.Value : runtimeEnvironment == "Development";
            string env = devMode ? "dev" : "prod";
            string paramName = $"/{env}{paramNameBase}";

            var chain = new CredentialProfileStoreChain(_awsOptions.ProfilesLocation);
            AWSCredentials awsCredentials;
            AmazonSimpleSystemsManagementClient systemsManagementClient;
            if (chain.TryGetAWSCredentials(_awsOptions.Profile, out awsCredentials))
            {
                systemsManagementClient = new AmazonSimpleSystemsManagementClient(awsCredentials, _awsOptions.Region);
            }
            else
            {
                systemsManagementClient = new AmazonSimpleSystemsManagementClient();
            }
            var response = await systemsManagementClient.GetParameterAsync(new GetParameterRequest
            {
                Name = paramName,
                WithDecryption = true
            });
            string connectionString = response.Parameter.Value;
            return connectionString;
        }
    }
}
