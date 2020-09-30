public class DatabaseSettings : IDatabaseSettings
{
    public string UsersCollectionName { get; set; }
    public string CampaignsCollectionName { get; set; }
    public string ConnectionString { get; set; }
    public string DatabaseName { get; set; }
}
public interface IDatabaseSettings
{
    string UsersCollectionName { get; set; }
    string CampaignsCollectionName { get; set; }
    string ConnectionString { get; set; }
    string DatabaseName { get; set; }
}