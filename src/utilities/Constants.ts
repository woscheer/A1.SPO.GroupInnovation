export class ListTitles {
    public static readonly SERVICE_PARTNER = "ServicePartner";
    public static readonly OPCOSTATUS = "OpCoStatus";
}

export class StandardFields {
    public static readonly ID = 'ID';
    public static readonly TITLE = 'Title';
    // Standard Created/Modified Columns
    public static readonly CREATED = 'Created';
    public static readonly MODIFIED = 'Modified';
    public static readonly AUTHOR = 'Author';
    public static readonly AUTHOR_ID = 'Author/ID';
    public static readonly AUTHOR_NAME = 'Author/Name';
    public static readonly AUTHOR_TITLE = 'Author/Title';
    public static readonly EDITOR = 'Editor';
    public static readonly EDITOR_ID = 'Editor/ID';
    public static readonly EDITOR_NAME = 'Editor/Name';
    public static readonly EDITOR_TITLE = 'Editor/Title';

    public static readonly CONTENTTYPE = 'ContentType';
    public static readonly CONTENTTYPEID = 'ContentTypeId';
    public static readonly CONTENTTYPE_NAME = 'ContentType/Name';
}

export class IServicePartnerFields {
    public static readonly DESCRIPTION_4_REPORT = 'ShortDescriptionReport';
    public static readonly SHORTLIST = 'Shortlist';
}

export class IOpCoStatusFields {
    public static readonly SERVICEPARTNER = 'ServicePartner';
    public static readonly SERVICEPARTNERID = 'ServicePartner/ID';
    public static readonly OPCOSTATUS = 'OpCoStatus';
    public static readonly OPCOICONURL = 'OpCoIconUrl';
    public static readonly OPCOIMAGEURLSTORAGE = 'OpCoImageUrlStorage';
    public static readonly OPCOCOMMENT = 'OpCoComment';
}

export class Stati {
    public static readonly stati: string[] = ['NEW','Ongoing','Assessment','POC','Partner Onboarding','Launched (product is live)','Delisted'];
}

export class HeaderText {
    public static readonly Assessment = 'presented to community & check relavance with experts';
    public static readonly Onboarding = 'Interest of partner introduction call or already connected with market experts';
    public static readonly POC = 'POC discussed, planned, in execution or done';
    public static readonly Launched = 'product or service is live';
    public static readonly Delisted = 'not relevant to be continued';
}

