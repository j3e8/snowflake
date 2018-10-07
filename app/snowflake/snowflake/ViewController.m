//
//  ViewController.m
//  snowflake
//
//  Created by Jacob Jenne on 10/7/18.
//  Copyright © 2018 Jacob Jenne. All rights reserved.
//

#import "ViewController.h"

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.

    NSURL *url = [[NSBundle mainBundle] URLForResource:@"index" withExtension:@"html"];
    [_webview loadRequest:[NSURLRequest requestWithURL:url]];
}


- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


@end
