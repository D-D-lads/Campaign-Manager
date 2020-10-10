public class DatabaseSettings : IDatabaseSettings
{
    public string UsersCollectionName { get; set; }
    public string CampaignsCollectionName { get; set; }
    public string PlotlineCollectionName { get; set; }
    public string CharacterCollectionName { get; set; }
    public string StatusCollectionName { get; set; }

    public string ConnectionString { get; set; }
    public string DatabaseName { get; set; }
}
public interface IDatabaseSettings
{
    string UsersCollectionName { get; set; }
    string CampaignsCollectionName { get; set; }
    string PlotlineCollectionName { get; set; }
    string CharacterCollectionName { get; set; }
    string StatusCollectionName { get; set; }
    string ConnectionString { get; set; }
    string DatabaseName { get; set; }
}