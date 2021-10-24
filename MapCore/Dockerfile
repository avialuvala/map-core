FROM microsoft/dotnet:2.2-aspnetcore-runtime AS base
 
WORKDIR /MapCore
COPY bin/Release/netcoreapp2.2/publish .
 
ENV ASPNETCORE_URLS http://+:5000
EXPOSE 5000
 
ENTRYPOINT ["dotnet", "MapCore.dll"]