
-- --------------------------------------------------
-- Entity Designer DDL Script for SQL Server 2005, 2008, 2012 and Azure
-- --------------------------------------------------
-- Date Created: 08/23/2021 00:22:31
-- Generated from EDMX file: E:\Users\Lohse\source\repos\BlackspotIE\BlackspotIE\Models\BlackSpotDataModel.edmx
-- --------------------------------------------------

SET QUOTED_IDENTIFIER OFF;
GO
USE [BlackspotDB];
GO
IF SCHEMA_ID(N'dbo') IS NULL EXECUTE(N'CREATE SCHEMA [dbo]');
GO

-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[FK_SuburbAccident]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[Accidents] DROP CONSTRAINT [FK_SuburbAccident];
GO

-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[Suburbs]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Suburbs];
GO
IF OBJECT_ID(N'[dbo].[Accidents]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Accidents];
GO

-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------

-- Creating table 'Suburbs'
CREATE TABLE [dbo].[Suburbs] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Name] nvarchar(max)  NOT NULL,
    [Postcode] nvarchar(max)  NOT NULL,
    [Geometry] nvarchar(max)  NOT NULL,
    [Lat] nvarchar(max)  NOT NULL,
    [Long] nvarchar(max)  NOT NULL
);
GO

-- Creating table 'Accidents'
CREATE TABLE [dbo].[Accidents] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Longitude] nvarchar(max)  NOT NULL,
    [Latitude] nvarchar(max)  NOT NULL,
    [SuburbId] int  NOT NULL
);
GO

-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------

-- Creating primary key on [Id] in table 'Suburbs'
ALTER TABLE [dbo].[Suburbs]
ADD CONSTRAINT [PK_Suburbs]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Accidents'
ALTER TABLE [dbo].[Accidents]
ADD CONSTRAINT [PK_Accidents]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------

-- Creating foreign key on [SuburbId] in table 'Accidents'
ALTER TABLE [dbo].[Accidents]
ADD CONSTRAINT [FK_SuburbAccident]
    FOREIGN KEY ([SuburbId])
    REFERENCES [dbo].[Suburbs]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_SuburbAccident'
CREATE INDEX [IX_FK_SuburbAccident]
ON [dbo].[Accidents]
    ([SuburbId]);
GO

-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------